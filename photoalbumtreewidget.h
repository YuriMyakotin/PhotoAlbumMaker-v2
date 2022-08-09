#ifndef PHOTOALBUMTREEWIDGET_H
#define PHOTOALBUMTREEWIDGET_H

#include <QTreeWidget>
#include <QMouseEvent>

class PhotoAlbumTreeWidget : public QTreeWidget
{
public:
	PhotoAlbumTreeWidget(QWidget *parent = nullptr);
	void mousePressEvent ( QMouseEvent * event ) override;
};

#endif // PHOTOALBUMTREEWIDGET_H
