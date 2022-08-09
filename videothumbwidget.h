#ifndef VIDEOTHUMBWIDGET_H
#define VIDEOTHUMBWIDGET_H

#include <QWidget>
#include "PhotoAlbumData.h"

namespace Ui {
	class VideoThumbWidget;
}

class VideoThumbWidget : public QWidget
{
	Q_OBJECT

public:
	explicit VideoThumbWidget(VideoInfo * Info,QWidget *parent = nullptr);
	~VideoThumbWidget() override;
	void Update() const;
	VideoInfo *VidInfo;
private:
	Ui::VideoThumbWidget *ui;
};

#endif // VIDEOTHUMBWIDGET_H
