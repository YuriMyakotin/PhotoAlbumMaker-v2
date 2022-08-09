#ifndef IMAGETHUMBWIDGET_H
#define IMAGETHUMBWIDGET_H

#include <QWidget>
#include <QMutex>
#include "PhotoAlbumData.h"

namespace Ui {
	class ImageThumbWidget;
}

class ImageThumbWidget : public QWidget
{
	Q_OBJECT

public:
	const int32_t ThumbSize=96;
	explicit ImageThumbWidget(ImageInfo *Info, QWidget *parent = nullptr);
	~ImageThumbWidget() override;
	void LoadThumb();
	ImageInfo *ImgInfo;
public slots:
	void onImgFileLoaded(void * ImgPtr) const;
private:
	QMutex mutex;
	bool isDestroyed=false;
	Ui::ImageThumbWidget *ui;
};


#endif // IMAGETHUMBWIDGET_H
