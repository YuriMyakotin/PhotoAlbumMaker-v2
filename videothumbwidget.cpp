#include "videothumbwidget.h"
#include "ui_videothumbwidget.h"
#include "mainwindow.h"
#include "resizeimage.h"


VideoThumbWidget::VideoThumbWidget(VideoInfo * Info,QWidget *parent) :
	QWidget(parent),
	ui(new Ui::VideoThumbWidget)
{
	ui->setupUi(this);
	VidInfo=Info;
	Update();
}

VideoThumbWidget::~VideoThumbWidget()
{
	delete ui;
}

void VideoThumbWidget::Update() const
{
	ui->VideoNameLabel->setText(VidInfo->Description);

	const QString ThumbName=MainWindow::MainWindowPtr->SitePath+"/Videos/thumb_"+VidInfo->Name+".jpg";
	if (QFile::exists(ThumbName))
	{
		const QImage ThumbImage(ThumbName);
		constexpr int32_t height=180;
		const int32_t width=(height*ThumbImage.width()/ThumbImage.height());
		const QImage *Thumb=ResizeImage::Resize(&ThumbImage,width,height);
		ui->VideoThumbLabel->setPixmap(QPixmap().fromImage(*Thumb));
		delete Thumb;
	}
	else
	{
		ui->VideoThumbLabel->setPixmap(QIcon(":/icons/icons/no-image.svg").pixmap(320,180));
	}

}
