#include "editvideodialog.h"
#include "ui_editvideodialog.h"
#include "mainwindow.h"
#include <QVideoFrame>
#include <QMessageBox>
#include "resizeimage.h"

EditVideoDialog::EditVideoDialog(VideoInfo * Info,QWidget *parent) :
	QDialog(parent),
	ui(new Ui::EditVideoDialog)
{
	ui->setupUi(this);
	VidInfo=Info;
	ui->VideoNameLabel->setText(Info->Name);
	ui->VideoDescriptionEdit->setText(Info->Description);
	const QString ThumbName=MainWindow::MainWindowPtr->SitePath+"/Videos/thumb_"+Info->Name+".jpg";
	if (QFile::exists(ThumbName))
	{
		ThumbImage.load(ThumbName);
		constexpr int32_t height=180;
		const int32_t width=(height*ThumbImage.width()/ThumbImage.height());
		const QImage *Thumb=ResizeImage::Resize(&ThumbImage,width,height);
		ui->ThumbLabel->setPixmap(QPixmap().fromImage(*Thumb));
		delete Thumb;
	}
	else
	{
		ui->ThumbLabel->setPixmap(QIcon(":/icons/icons/no-image.svg").pixmap(320,180));
	}

	const QDir VideosDir(MainWindow::MainWindowPtr->SitePath+"/Videos/");
	MP.setSource(VideosDir.absoluteFilePath(VidInfo->Name));
	MP.setVideoOutput(&VI);
	VI.setPos(0,0);
	VI.setSize(QSize(640,360));
	ui->GraphicsView->setScene(new QGraphicsScene(0,0,640,360));
	ui->GraphicsView->scene()->addItem(&VI);

	MP.setAudioOutput(&AudioOut);
	MP.stop();


	connect(ui->StopButton,&QPushButton::clicked,this,&EditVideoDialog::Stop);
	connect(ui->PlayButton,&QPushButton::clicked,this,&EditVideoDialog::PlayOrPause);
	connect(&MP,&QMediaPlayer::positionChanged,this,&EditVideoDialog::PositionChanged);
	connect(&MP,&QMediaPlayer::durationChanged,this,&EditVideoDialog::DurationChanged);
	connect(ui->PlaybackProgressSlider,&QSlider::sliderMoved,this,&EditVideoDialog::onManualPositionSet);
	connect(ui->GetThumbImageButton,&QPushButton::clicked,this,&EditVideoDialog::onCreateThumb);

	connect(ui->buttonBox,&QDialogButtonBox::accepted,this,&EditVideoDialog::onAccept);
}

EditVideoDialog::~EditVideoDialog()
{
	delete ui;
}

void EditVideoDialog::PlayOrPause()
{
	ui->StopButton->setEnabled(true);
	if (MP.playbackState()==QMediaPlayer::PlaybackState::PlayingState)
	{
		MP.pause();
		ui->PlayButton->setIcon(QIcon(":/icons/icons/play.svg"));
	}
	else
	{
		MP.play();
		ui->PlayButton->setIcon(QIcon(":/icons/icons/pause.svg"));

	}
}

void EditVideoDialog::Stop()
{
	ui->StopButton->setEnabled(false);
	ui->PlayButton->setIcon(QIcon(":/icons/icons/play.svg"));
	MP.stop();
}

void EditVideoDialog::DurationChanged(const qint64 duration) const
{
	ui->PlaybackProgressSlider->setMaximum(duration);
}

void EditVideoDialog::PositionChanged(const qint64 position) const
{
	ui->PlaybackProgressSlider->setSliderPosition(position);
	ui->TimeLabel->setText(QTime::fromMSecsSinceStartOfDay(position).toString("hh:mm:ss"));
}

void EditVideoDialog::onManualPositionSet(const int position)
{
	MP.setPosition(position);
}

void EditVideoDialog::onCreateThumb()
{
	QImage Img=VI.videoSink()->videoFrame().toImage();
	if (Img.format()!=QImage::Format_RGB32)
		Img.convertTo(QImage::Format_RGB32,Qt::ColorOnly);

	int32_t height=MainWindow::MainWindowPtr->ThumbSize*0.8;
	int32_t width=(height*Img.width()/Img.height());
	const QImage *Thumb=ResizeImage::Resize(&Img,width,height);
	ThumbImage=*Thumb;

	delete Thumb;

	height=180;
	width=(height*Img.width()/Img.height());
	Thumb=ResizeImage::Resize(&Img,width,height);
	ui->ThumbLabel->setPixmap(QPixmap().fromImage(*Thumb));
	delete Thumb;
	isThumbChanged=true;
}

void EditVideoDialog::onAccept()
{
	if (ui->VideoDescriptionEdit->text().isEmpty())
	{
		QMessageBox::warning(this,"Error","Video Name field cannot be empty");
		return;
	}
	VidInfo->Description=ui->VideoDescriptionEdit->text();
	if ((!ThumbImage.isNull())&&isThumbChanged) ThumbImage.save(MainWindow::MainWindowPtr->SitePath+"/Videos/thumb_"+VidInfo->Name+".jpg","jpg",MainWindow::MainWindowPtr->ThumbQuality);
	accept();
}
