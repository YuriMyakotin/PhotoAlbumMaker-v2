#ifndef PHOTOALBUMDATA_H
#define PHOTOALBUMDATA_H

#include <QString>
#include <QList>
#include <QTreeWidgetItem>

struct ImageInfo
{
	int32_t FolderID;
	QString Name; //name
	QString Comments; //comments
	QString Datetime;  //date-time
	QString CameraName; //camera name
	int32_t ISO; //iso
	double FocalLength; //focal length
	QString Exposure;  //exposure in string format like 1/125
	QString Aperture;  //aperture
	double Latitide; //gps latitude
	double Longtitude; //gps longitude
	double Altitude; //gps altitude
};

struct VideoInfo
{
	int32_t FolderID;
	QString Name; //name
	QString Description; //description
};

struct FolderInfo
{
	int32_t FolderID;   //id
	QString FolderName; //name
	int32_t ParentFolderID; //parent id, 0 = root folder
	QString Comments;  //comments
	int32_t ThumbFolderID;  //thumb folder
	QString  ThumbName; //thumb name
	QList<ImageInfo*> ImagesList;
	QList<VideoInfo*> VideosList;
};




class AlbumTreeItem:public QTreeWidgetItem
{
public:
	AlbumTreeItem(FolderInfo * FI):QTreeWidgetItem()
	{
		Info=FI;
	}
	FolderInfo *Info;

};


#endif // PHOTOALBUMDATA_H
