#include "photoalbumtreewidget.h"

PhotoAlbumTreeWidget::PhotoAlbumTreeWidget(QWidget *parent):QTreeWidget(parent)
{

}

void PhotoAlbumTreeWidget::mousePressEvent ( QMouseEvent * event )
{
   if(event->button() == Qt::RightButton)
	   event->accept(); // accept event and do nothing
   else
	   QTreeWidget::mousePressEvent(event);
}
