#ifndef EDITVIDEODIALOG_H
#define EDITVIDEODIALOG_H

#include <QDialog>
#include <QMediaPlayer>
#include <QAudioOutput>
#include <QGraphicsVideoItem>
#include <QVideoSink>

#include "PhotoAlbumData.h"

namespace Ui {
	class EditVideoDialog;
}

class EditVideoDialog : public QDialog
{
	Q_OBJECT

public:
	explicit EditVideoDialog(VideoInfo * Info, QWidget *parent = nullptr);
	~EditVideoDialog();

public slots:
	void PlayOrPause();
	void Stop();
	void PositionChanged(qint64 position) const;
	void DurationChanged(qint64 duration) const;
	void onManualPositionSet(int position);
	void onCreateThumb();
	void onAccept();
private:
	QMediaPlayer MP;
	QAudioOutput AudioOut;
	QGraphicsVideoItem VI;
	QImage ThumbImage;
	VideoInfo * VidInfo;
	bool isThumbChanged=false;
	Ui::EditVideoDialog *ui;
};

#endif // EDITVIDEODIALOG_H
