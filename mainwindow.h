#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <PhotoAlbumData.h>
#include <QMap>
#include <QHash>
#include <QTimer>
#include <QSettings>
#include <QDir>
#include <QMenu>

QT_BEGIN_NAMESPACE
namespace Ui { class MainWindow; }
QT_END_NAMESPACE

class MainWindow : public QMainWindow
{
	Q_OBJECT

public:
	MainWindow(QWidget *parent = nullptr);
	~MainWindow() override;
	int32_t SiteConfigVersion; //1xx - obsolete, from v1.1
	bool isPrivate; //true = disable right clicks and downloads
	QString AlbumName; //name
	QString Description; //description
	int32_t SlideSize;  //images size
	int8_t SlideQuality; //images quality
	int32_t ThumbSize; //thumbs size
	int8_t ThumbQuality; //thumbs quality
	int32_t TotalImages=0; //total images count
	int32_t TotalVideos=0; //total videos count
	QString LastChangedTime;
	bool isSiteLoaded=false;

	int32_t CurrentFolderID=0;
	int32_t LastFolderID=0;

	bool isBackupCreated=false;
	bool hasUnsavedChanges=false;
	QTimer SavingTimer;

	QString SitePath;
	bool LoadSiteData();
	void CloseSite();
	void StartSaving();
	bool CopySiteContent() const;

	void LoadFolderThumb(const FolderInfo * FI);

	void RecreateSlidesAndThumbs(const bool MakeSlide, const bool MakeThumb);


	bool MakeSlideAndThumb(const ImageInfo * Img, const bool MakeSlide, const bool MakeThumb) const;


	inline QString GetThumbFileName(const uint32_t FolderID, const QString& ImageName) const
	{
		const QDir ThumbDir(SitePath+"/"+QString::number(FolderID)+"/thumbs/");
		return ThumbDir.absoluteFilePath(ImageName);
	}
	inline QString GetSlideFileName(const uint32_t FolderID, const QString& ImageName) const
	{
		const QDir SlideDir(SitePath+"/"+QString::number(FolderID)+"/slides/");
		return SlideDir.absoluteFilePath(ImageName);
	}
	inline QString GetOriginalFileName(const uint32_t FolderID, const QString& ImageName) const
	{
		const QDir Dir(SitePath+"/"+QString::number(FolderID));
		return Dir.absoluteFilePath(ImageName);
	}

	static Ui::MainWindow *ui;
	static MainWindow* MainWindowPtr;

	static constexpr int32_t FolderIconSize=64;

	const QString IniName="PhotoAlbumMaker.ini";
	const int32_t PhotoAlbumVersion=200;

	QSettings * settings;

	int32_t Progress;

	QMap<uint32_t,AlbumTreeItem *> AlbumFolders;
	QHash<QString,ImageInfo*> CurrentFolderImages;

	void Start();

	void UpdateActionsStatus() const;

	void ConnectFolderTreeWidget();

public slots:
	void onFolderThumbLoaded(int FolderID,void * ImgPtr) const;

	void onAlbumOpen();
	void onNewAlbum();
	void onAlbumSettingsEdit();
	void onExifRescan();

	void onAbout();

	void onNewRootFolder();
	void onNewSubFolder(int32_t FolderID=0);
	void onEditFolder(int32_t FolderID=0);
	void onDeleteFolder(int32_t FolderID=0);

	void onContextMenuNewFolder();
	void onContextMenuEditFolder();
	void onContextMenuDeleteFolder();

	void onFolderContextMenuRequested(const QPoint &pos);


	void onAddImages();
	void onEditImageDescription();
	void onDeleteImages();
	void onSetImageAsThumb();

	void onAddVideo();
	void onEditVideo();
	void onDeleteVideo();

	void onFolderSelectionChanged(QTreeWidgetItem *current, QTreeWidgetItem *previous);

	void onFolderMoved(const QModelIndex &parent, int first, int last);
	void onImageMoved(const QModelIndex &parent, int start, int end, const QModelIndex &destination, int row);
	void onVideoMoved(const QModelIndex &parent, int start, int end, const QModelIndex &destination, int row);
	void onImageOrVideoSelectionChanged() const;


	void onProgressUpdate();

	void SaveSiteData();

protected:
	 void closeEvent(QCloseEvent *event) override;

private:
	QMenu FoldersContextMenu;
	bool ReadExifData(ImageInfo* ImgInfo) const;

	void SaveImagesOrder();
	void SaveVideosOrder();

	void DeleteVideoFile(const VideoInfo* VidInfo) const;

	void NewFolder(const QString& FolderName, const QString& FolderDescription, const int32_t ParentFolderID);

	void FolderToJson(QJsonArray &FoldersArray, const AlbumTreeItem *Folder, int32_t ParentFolderID);


};
#endif // MAINWINDOW_H
