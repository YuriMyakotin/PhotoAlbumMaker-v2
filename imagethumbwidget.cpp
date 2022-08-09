#include "imagethumbwidget.h"
#include "ui_imagethumbwidget.h"
#include <QImage>
#include <QMetaObject>
#include <resizeimage.h>
#include "mainwindow.h"
#include <QtConcurrent>


ImageThumbWidget::ImageThumbWidget(ImageInfo *Info,QWidget *parent) :
	QWidget(parent),
	ui(new Ui::ImageThumbWidget)
{
	ui->setupUi(this);

	ImgInfo=Info;
	ui->NameLabel->setText(Info->Name);
	 static_cast<void>(QtConcurrent::run([this] {LoadThumb();}));
}

ImageThumbWidget::~ImageThumbWidget()
{
	QMutexLocker lock(&mutex);
	isDestroyed=true;
	delete ui;
}

void ImageThumbWidget::onImgFileLoaded(void * ImgPtr) const
{
	if (ImgPtr!=nullptr)
	{
		const QImage * Img=static_cast<QImage*>(ImgPtr);
		ui->ImgLabel->setPixmap(QPixmap::fromImage(*Img));
		delete Img;
	}
}


void ImageThumbWidget::LoadThumb()
{
	QMutexLocker lock(&mutex);
	if (isDestroyed) return;
	void * ImgPtr=nullptr;
	const QImage OriginalImg(MainWindow::MainWindowPtr->GetThumbFileName(ImgInfo->FolderID,ImgInfo->Name));
	if (!OriginalImg.isNull())
	{
		QImage * Img=ResizeImage::Resize(&OriginalImg,ThumbSize,ThumbSize);
		ImgPtr=Img;
	}

	QMetaObject::invokeMethod(this,"onImgFileLoaded",Qt::QueuedConnection,Q_ARG(void *,ImgPtr));
}
