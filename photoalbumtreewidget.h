#ifndef PHOTOALBUMTREEWIDGET_H
#define PHOTOALBUMTREEWIDGET_H

#include <QTreeWidget>
#include <QMouseEvent>

class PhotoAlbumTreeWidget final : public QTreeWidget
{
public:
	explicit PhotoAlbumTreeWidget(QWidget *parent = nullptr);
	void mousePressEvent ( QMouseEvent * event ) override;
};

#endif // PHOTOALBUMTREEWIDGET_H
