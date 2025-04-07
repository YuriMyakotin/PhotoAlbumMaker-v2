#include "mainwindow.h"
#include "ui_mainwindow.h"
#include <QImage>
#include <QPixmap>
#include <QImageReader>
#include <QImageWriter>
#include <QJsonDocument>
#include <QJsonArray>
#include <QJsonObject>
#include <QJsonParseError>
#include <QByteArray>
#include <QDateTime>
#include <QFile>
#include <QDir>
#include <QFileDialog>
#include <QFileInfo>
#include <QListWidget>
#include <QIcon>
#include <QMessageBox>
#include "imagethumbwidget.h"
#include "resizeimage.h"
#include "videothumbwidget.h"
#include <qtconcurrentrun.h>
#include "TinyEXIF.h"
#include "sitesettingsdialog.h"
#include "editfolderdialog.h"
#include "editimagedescriptiondialog.h"
#include "editvideodialog.h"
#include "setfolderthumbdialog.h"
#include "ui_editfolderdialog.h"
#include "aboutdialog.h"
#include <fstream>
#include <cmath>
#include "editcolorsdialog.h"
#include "sitecolors.h"

Ui::MainWindow* MainWindow::ui;
MainWindow* MainWindow::MainWindowPtr;

MainWindow::MainWindow(QWidget *parent)
	: QMainWindow(parent)
{
	ui=new Ui::MainWindow;
	ui->setupUi(this);
	MainWindowPtr=this;
	SavingTimer.setSingleShot(true);
	ui->progressBar->setVisible(false);

	ui->FoldersTreeWidget->setIconSize(QSize(FolderIconSize,FolderIconSize));


	FoldersContextMenu.addAction(ui->actionContextMenuAddFolder);
	FoldersContextMenu.addAction(ui->actionContextMenuEditFolder);
	FoldersContextMenu.addAction(ui->actionContextMenuDeleteFolder);

	ui->ImagesListWidget->addAction(ui->actionAddImages);
	ui->ImagesListWidget->addAction(ui->actionEditImageDescription);
	ui->ImagesListWidget->addAction(ui->actionDeleteImages);
	ui->ImagesListWidget->addAction(ui->actionSetAsFolderThumbnail);

	ui->VideosListWidget->addAction(ui->actionAddVideos);
	ui->VideosListWidget->addAction(ui->actionEditVideo);
	ui->VideosListWidget->addAction(ui->actionDeleteVideo);

	settings=new QSettings(IniName,QSettings::IniFormat);
	settings->sync();

	resize(settings->value("mainwindow/size",QSize(800,600)).toSize());
	if (settings->value("mainwindow/maximized",false).toBool()) setWindowState(Qt::WindowMaximized);

	QList<int> tmp;
	tmp.append(settings->value("splitter/folderswidget",360).toInt());
	tmp.append(settings->value("splitter/imageswidget",430).toInt());
	ui->Splitter->setSizes(tmp);

	SitePath=settings->value("sitepath","").toString();

	connect(&SavingTimer,&QTimer::timeout,this,&MainWindow::SaveSiteData);


	connect(ui->ImagesListWidget,&QListWidget::itemSelectionChanged,this,&MainWindow::onImageOrVideoSelectionChanged);
	connect(ui->VideosListWidget,&QListWidget::itemSelectionChanged,this,&MainWindow::onImageOrVideoSelectionChanged);

	connect(ui->actionOpenAlbum,&QAction::triggered,this,&MainWindow::onAlbumOpen);
	connect(ui->actionNewAlbum,&QAction::triggered,this,&MainWindow::onNewAlbum);
	connect(ui->actionEditAlbumSettings,&QAction::triggered,this,&MainWindow::onAlbumSettingsEdit);
    connect(ui->actionEditsitecolors,&QAction::triggered,this,&MainWindow::onEditColors);
	connect(ui->actionRescan_Exif,&QAction::triggered,this,&MainWindow::onExifRescan);
	connect(ui->actionAbout,&QAction::triggered,this,&MainWindow::onAbout);

	connect(ui->actionAddImages,&QAction::triggered,this,&MainWindow::onAddImages);
	connect(ui->actionEditImageDescription,&QAction::triggered,this,&MainWindow::onEditImageDescription);
	connect(ui->actionDeleteImages,&QAction::triggered,this,&MainWindow::onDeleteImages);
	connect(ui->actionSetAsFolderThumbnail,&QAction::triggered,this,&MainWindow::onSetImageAsThumb);

	connect(ui->actionNewRootFolder,&QAction::triggered,this,&MainWindow::onNewRootFolder);
	connect(ui->actionNewSubFolder,&QAction::triggered,this,&MainWindow::onNewSubFolder);
	connect(ui->actionEditFolder,&QAction::triggered,this,&MainWindow::onEditFolder);
	connect(ui->actionDeleteFolder,&QAction::triggered,this,&MainWindow::onDeleteFolder);

    connect(ui->actionExpand_All,&QAction::triggered,this,&MainWindow::onExpandAllFolders);
    connect(ui->actionCollapse_All,&QAction::triggered,this,&MainWindow::onCollapseAllFolders);

	connect(ui->actionAddVideos,&QAction::triggered,this,&MainWindow::onAddVideo);
	connect(ui->actionEditVideo,&QAction::triggered,this,&MainWindow::onEditVideo);
	connect(ui->actionDeleteVideo,&QAction::triggered,this,&MainWindow::onDeleteVideo);

	connect(ui->actionContextMenuAddFolder,&QAction::triggered,this,&MainWindow::onContextMenuNewFolder);
	connect(ui->actionContextMenuEditFolder,&QAction::triggered,this,&MainWindow::onContextMenuEditFolder);
	connect(ui->actionContextMenuDeleteFolder,&QAction::triggered,this,&MainWindow::onContextMenuDeleteFolder);

	connect(ui->ImagesListWidget->model(),&QAbstractItemModel::rowsMoved,this,&MainWindow::onImageMoved);
	connect(ui->VideosListWidget->model(),&QAbstractItemModel::rowsMoved,this,&MainWindow::onVideoMoved);
}

MainWindow::~MainWindow()
{
	delete ui;
}

void MainWindow::ConnectFolderTreeWidget()
{
	ui->FoldersTreeWidget->disconnect();
	connect(ui->FoldersTreeWidget,&QTreeWidget::currentItemChanged,this,&MainWindow::onFolderSelectionChanged);
	connect(ui->FoldersTreeWidget->model(),&QAbstractItemModel::rowsInserted,this,&MainWindow::onFolderMoved);
	connect(ui->FoldersTreeWidget,&QTreeWidget::customContextMenuRequested,this,&MainWindow::onFolderContextMenuRequested);
}

void MainWindow::Start()
{
	UpdateActionsStatus();
    if (!SitePath.isEmpty()) onAlbumOpen();
}

void MainWindow::LoadFolderThumb(const FolderInfo *FI)
{
	void * ImgPtr=nullptr;
	if(FI->ThumbFolderID!=0)
	{
		const QImage ThumbImg(GetThumbFileName(FI->ThumbFolderID,FI->ThumbName));
		if (!ThumbImg.isNull())
		{
			QImage * Img=ResizeImage::Resize(&ThumbImg,MainWindow::FolderIconSize,MainWindow::FolderIconSize);
			ImgPtr=Img;
		}
	}
	QMetaObject::invokeMethod(this,"onFolderThumbLoaded",Qt::QueuedConnection,Q_ARG(int,FI->FolderID), Q_ARG(void *,ImgPtr));
}

void MainWindow::onAlbumOpen()
{
	if (isSiteLoaded) CloseSite();
	const QString ConfigFile=QFileDialog::getOpenFileName(this,"Open album folder",SitePath,"PhotoAlbum Data (site.json)");
	if (ConfigFile.isNull()||ConfigFile.isEmpty()) return;
	SitePath=QFileInfo(ConfigFile).absolutePath();
	if (!LoadSiteData())
	{
		QMessageBox::critical(this,"Error","Can't read album configuration file "+ConfigFile);
		UpdateActionsStatus();
		return;
	}
	settings->setValue("sitepath",SitePath);
	settings->sync();
	UpdateActionsStatus();

}

void MainWindow::UpdateActionsStatus() const
{
	ui->actionNewRootFolder->setEnabled(isSiteLoaded);
	ui->actionEditAlbumSettings->setEnabled(isSiteLoaded);
    ui->actionEditsitecolors->setEnabled(isSiteLoaded);
	ui->actionRescan_Exif->setEnabled(TotalImages!=0);

	if (ui->FoldersTreeWidget->currentItem()==nullptr)
	{
		ui->actionNewSubFolder->setEnabled(false);
		ui->actionDeleteFolder->setEnabled(false);
		ui->actionEditFolder->setEnabled(false);
		ui->actionAddImages->setEnabled(false);
		ui->actionAddVideos->setEnabled(false);
	}
	else
	{
		ui->actionNewSubFolder->setEnabled(true);
		ui->actionDeleteFolder->setEnabled(true);
		ui->actionEditFolder->setEnabled(true);
		ui->actionAddImages->setEnabled(true);
		ui->actionAddVideos->setEnabled(true);
	}


	ui->actionDeleteImages->setEnabled(ui->ImagesListWidget->selectedItems().count()>0);
	ui->actionDeleteVideo->setEnabled(ui->VideosListWidget->selectedItems().count()>0);
	if (ui->ImagesListWidget->selectedItems().count()==1)
	{
		ui->actionEditImageDescription->setEnabled(true);
		ui->actionSetAsFolderThumbnail->setEnabled(true);
	}
	else
	{
		ui->actionEditImageDescription->setEnabled(false);
		ui->actionSetAsFolderThumbnail->setEnabled(false);
	}

	ui->actionEditVideo->setEnabled(ui->VideosListWidget->selectedItems().count()==1);

}

void MainWindow::onImageOrVideoSelectionChanged() const
{
	UpdateActionsStatus();
}


bool MainWindow::LoadSiteData()
{


	QApplication::setOverrideCursor(Qt::WaitCursor);
	disconnect(ui->FoldersTreeWidget);
	ui->FoldersTreeWidget->setEnabled(false);

	LastFolderID=0;
	TotalImages=0;
	TotalVideos=0;
	CurrentFolderID=0;
	isBackupCreated=false;
	hasUnsavedChanges=false;

	const QString FileName=QDir(SitePath).filePath("Site.json");
	QFile File(FileName);
	if (!File.open(QIODeviceBase::ReadOnly)) return false;
	const QByteArray FileBytes=File.readAll();
	File.close();
	if (FileBytes.isNull()||FileBytes.isEmpty()) return false;
	QList<uint32_t> FoldersOrder;
	const QJsonDocument JsonDoc=QJsonDocument::fromJson(FileBytes);
	if (JsonDoc.isNull()||JsonDoc.isEmpty()) return false;
	const QJsonObject RootObj=JsonDoc.object();
	AlbumName=RootObj.value("N").toString();
	Description=RootObj.value("D").toString();
	SlideSize=RootObj.value("IS").toInt();
	SlideQuality=RootObj.value("IQ").toInt();
	ThumbSize=RootObj.value("TS").toInt();
	ThumbQuality=RootObj.value("TQ").toInt();
	TotalImages=RootObj.value("TIC").toInt();
	TotalVideos=RootObj.value("TVC").toInt();
	LastChangedTime=RootObj.value("LC").toString();
	isPrivate=RootObj.value("P").toBool(false);
	SiteConfigVersion=RootObj.value("V").toInt(110);

    if (SiteConfigVersion<300)
        SiteColors::ResetColorsToDefault();
    else
    {
        SiteColors::BgColor=QColor(RootObj.value("BgColor").toString());
        SiteColors::BottomInfoBarColor=QColor(RootObj.value("InfoBarColor").toString());
        SiteColors::NavBarLinkColor=QColor(RootObj.value("NavBarLinkColor").toString());
        SiteColors::NavBarCurrentFolderNameColor=QColor(RootObj.value("NavBarCurrentFolderColor").toString());
        SiteColors::FolderNameColor=QColor(RootObj.value("FolderNameColor").toString());
        SiteColors::VideoNameColor=QColor(RootObj.value("VideoNameColor").toString());
        SiteColors::FolderDescriptionColor=QColor(RootObj.value("FolderDescriptionColor").toString());
        SiteColors::ImageNameColor=QColor(RootObj.value("ImageNameColor").toString());
        SiteColors::ExifInfoColor=QColor(RootObj.value("ExifInfoColor").toString());
        SiteColors::GPSInfoColor=QColor(RootObj.value("GPSInfoColor").toString());
        SiteColors::ImageDescriptionColor=QColor(RootObj.value("ImageDescriptionColor").toString());
        SiteColors::FolderColors.clear();
        const QJsonArray FolderColors=RootObj.value("FolderColors").toArray();
        for(const auto value:FolderColors)
        {
            SiteColors::FolderColors.emplace_back(value.toString());
        }
    }

    const QJsonArray SubFolders=RootObj.value("F").toArray();
	for(const auto value:SubFolders)
	{
		QJsonObject Folder = value.toObject();
		const int32_t FolderID=Folder.value("I").toInt();
		if (LastFolderID<FolderID) LastFolderID=FolderID;
		FolderInfo *FolderItem= new FolderInfo();
		FolderItem->FolderID=FolderID;
		FolderItem->FolderName=Folder.value("N").toString();
		FolderItem->ParentFolderID=Folder.value("PI").toInt();
		FolderItem->Comments=Folder.value("C").toString();
		FolderItem->ThumbFolderID=Folder.value("TF").toInt();
		FolderItem->ThumbName=Folder.value("TN").toString();

		if (Folder.value("Im").isArray())
		{
            const QJsonArray ImagesArray=Folder.value("Im").toArray();

			for(const auto img:ImagesArray)
			{
				QJsonObject ImgObj=img.toObject();
				ImageInfo * ImgInfo= new ImageInfo();
				ImgInfo->FolderID=FolderID;
				ImgInfo->Name=ImgObj.value("N").toString();
				ImgInfo->Comments=ImgObj.value("C").toString();
				ImgInfo->Datetime=ImgObj.value("D").toString();
				ImgInfo->CameraName=ImgObj.value("Cn").toString();
				ImgInfo->ISO=ImgObj.value("I").toInt();
				ImgInfo->FocalLength=ImgObj.value("F").toDouble();
				ImgInfo->Exposure=ImgObj.value("E").toString();
				ImgInfo->Aperture=ImgObj.value("A").toString();
				ImgInfo->Latitide=ImgObj.value("La").toDouble();
				ImgInfo->Longtitude=ImgObj.value("Lo").toDouble();
				ImgInfo->Altitude=ImgObj.value("Al").toDouble();

				//for old version compatibility
				if (ImgObj.value("I").isString()) ImgInfo->ISO=ImgObj.value("I").toString().toInt();
				if (ImgObj.value("F").isString()) ImgInfo->FocalLength=ImgObj.value("F").toString().toDouble();
				if (ImgObj.value("La").isString()) ImgInfo->Latitide=ImgObj.value("La").toString().toDouble();
				if (ImgObj.value("Lo").isString()) ImgInfo->Longtitude=ImgObj.value("Lo").toString().toDouble();
				if (ImgObj.value("Al").isString()) ImgInfo->Altitude=ImgObj.value("Al").toString().toDouble();

				FolderItem->ImagesList.append(ImgInfo);
				++TotalImages;

			}
		}

		if (Folder.value("V").isArray())
		{
            const QJsonArray VideosArray=Folder.value("V").toArray();
			for(const auto vid:VideosArray)
			{
				QJsonObject VidObj=vid.toObject();
				VideoInfo * VidInfo=new VideoInfo;

				VidInfo->FolderID=FolderID;
				VidInfo->Name=VidObj.value("N").toString();
				VidInfo->Description=VidObj.value("D").toString();

				FolderItem->VideosList.append(VidInfo);
				++TotalVideos;
			}
		}


		AlbumTreeItem * TreeItem=new AlbumTreeItem(FolderItem);

		TreeItem->setIcon(0,QIcon(":/icons/icons/no-image.svg"));
		TreeItem->setText(0,FolderItem->FolderName);
		TreeItem->setToolTip(0,FolderItem->Comments);

		AlbumFolders.insert(FolderID,TreeItem);
		FoldersOrder.append(FolderID);
		if (FolderItem->ParentFolderID==0)
			ui->FoldersTreeWidget->addTopLevelItem(TreeItem);



	}




	for(int32_t i=0;i<FoldersOrder.count();i++)
	{
		const FolderInfo * Folder=AlbumFolders[FoldersOrder[i]]->Info;
		if (Folder->ParentFolderID!=0) 	AlbumFolders[Folder->ParentFolderID]->addChild(AlbumFolders[FoldersOrder[i]]);
		static_cast<void>(QtConcurrent::run([this, Folder] {LoadFolderThumb(Folder);}));
	}

	ui->FoldersTreeWidget->setEnabled(true);
    if (AllFoldersExpanded) ui->FoldersTreeWidget->expandAll();
    else ui->FoldersTreeWidget->collapseAll();

	ConnectFolderTreeWidget();
	setWindowTitle("PhotoAlbum Maker - "+AlbumName);

	QApplication::restoreOverrideCursor();

	isSiteLoaded=true;

	if (SiteConfigVersion<PhotoAlbumVersion)
	{
		if (QMessageBox::question(this,"Obsolette PhotoAlbum version found","PhotoAlbum on this site needs to be updated from version "+QString::number(static_cast<qreal>(SiteConfigVersion)/100, 'f', 2)+" to "+QString::number((qreal)PhotoAlbumVersion/100, 'f', 2)+ " . Update now?" )!=QMessageBox::Yes)
		{
			CloseSite();
			return true;
		}
		if (!CopySiteContent())
		{
			QMessageBox::critical(this,"Error","Can't update required PhotoAlbum files");
			CloseSite();
			return true;
		}
		else StartSaving();
	}

	return true;
}

void MainWindow::onFolderContextMenuRequested(const QPoint &pos)
{
	QTreeWidgetItem * Item=ui->FoldersTreeWidget->itemAt(pos);
	int32_t FolderID=0;
	if (Item==nullptr)
	{


		ui->actionContextMenuAddFolder->setText("New root folder");
		ui->actionContextMenuEditFolder->setEnabled(false);
		ui->actionContextMenuDeleteFolder->setEnabled(false);

	}
	else
	{
		FolderID=dynamic_cast<AlbumTreeItem*>(Item)->Info->FolderID;
		ui->actionContextMenuAddFolder->setText("New subfolder");
		ui->actionContextMenuEditFolder->setEnabled(true);
		ui->actionContextMenuDeleteFolder->setEnabled(true);
	}

	ui->actionContextMenuAddFolder->setData(FolderID);
	ui->actionContextMenuEditFolder->setData(FolderID);
	ui->actionContextMenuDeleteFolder->setData(FolderID);
	FoldersContextMenu.exec(mapToGlobal(pos));
}


void MainWindow::onFolderSelectionChanged(QTreeWidgetItem *current, const QTreeWidgetItem *previous)
{
	Q_UNUSED(previous)

	CurrentFolderImages.clear();

	ui->ImagesListWidget->setEnabled(false);
	ui->ImagesListWidget->clear();
	if (current==nullptr) return;

	QApplication::setOverrideCursor(Qt::WaitCursor);
	FolderInfo * CurrentFolder= dynamic_cast<AlbumTreeItem*>(current)->Info;
	CurrentFolderID=CurrentFolder->FolderID;


	ui->tabWidget->setTabText(0,"Images : "+QString::number(CurrentFolder->ImagesList.count()));
	ui->tabWidget->setTabText(1,"Videos : "+QString::number(CurrentFolder->VideosList.count()));

	if(CurrentFolder->ImagesList.count()<2)
		ui->ImagesListWidget->setDragDropMode(QAbstractItemView::NoDragDrop);
	else ui->ImagesListWidget->setDragDropMode(QAbstractItemView::InternalMove);

	for(const auto &img:CurrentFolder->ImagesList)
	{
		QListWidgetItem *WI=new QListWidgetItem(ui->ImagesListWidget);
		ImageThumbWidget * Widget=new ImageThumbWidget(img);
		WI->setSizeHint(Widget->sizeHint());
		ui->ImagesListWidget->addItem(WI);
		ui->ImagesListWidget->setItemWidget(WI,Widget);
		CurrentFolderImages.insert(img->Name.toUpper(),img);
	}
	ui->ImagesListWidget->setEnabled(true);


	ui->VideosListWidget->setEnabled(false);
	ui->VideosListWidget->clear();
	if(CurrentFolder->VideosList.count()<2)
		ui->VideosListWidget->setDragDropMode(QAbstractItemView::NoDragDrop);
	else ui->VideosListWidget->setDragDropMode(QAbstractItemView::InternalMove);
	for (const auto &vid:CurrentFolder->VideosList)
	{
		QListWidgetItem *WI=new QListWidgetItem(ui->VideosListWidget);
		VideoThumbWidget *Widget=new VideoThumbWidget(vid);
		WI->setSizeHint(Widget->sizeHint());
		ui->VideosListWidget->addItem(WI);
		ui->VideosListWidget->setItemWidget(WI,Widget);
	}

	ui->VideosListWidget->setEnabled(true);


	QApplication::restoreOverrideCursor();
	UpdateActionsStatus();
}


void MainWindow::closeEvent(QCloseEvent *event)
{
	if (isAsyncJobRunning) return;
	if (hasUnsavedChanges) SaveSiteData();


	settings->setValue("mainwindow/size",size());
	settings->setValue("mainwindow/maximized",this->isMaximized());
	QList<int> tmp=ui->Splitter->sizes();
	settings->setValue("splitter/folderswidget",tmp[0]);
	settings->setValue("splitter/imageswidget",tmp[1]);
	settings->sync();

	QMainWindow::closeEvent(event);
}

void MainWindow::StartSaving()
{
	hasUnsavedChanges=true;
    SavingTimer.start(30000);
}

void MainWindow::SaveSiteData()
{
	if (isAsyncJobRunning) return;
	SavingTimer.stop();

	if(!isBackupCreated)
	{
		QFile::remove(QDir(SitePath).filePath("Site.json.bak"));
		if (QFile::rename(QDir(SitePath).filePath("Site.json"),QDir(SitePath).filePath("Site.json.bak")))
			isBackupCreated=true;
	}

    TotalImages=0;
    TotalVideos=0;
    QJsonObject RootObj;

    RootObj.insert("BgColor",SiteColors::BgColor.name());
    RootObj.insert("InfoBarColor",SiteColors::BottomInfoBarColor.name());
    RootObj.insert("NavBarLinkColor",SiteColors::NavBarLinkColor.name());
    RootObj.insert("NavBarCurrentFolderColor",SiteColors::NavBarCurrentFolderNameColor.name());
    RootObj.insert("FolderNameColor",SiteColors::FolderNameColor.name());
    RootObj.insert("VideoNameColor",SiteColors::VideoNameColor.name());
    RootObj.insert("FolderDescriptionColor",SiteColors::FolderDescriptionColor.name());
    RootObj.insert("ImageNameColor",SiteColors::ImageNameColor.name());
    RootObj.insert("ExifInfoColor",SiteColors::ExifInfoColor.name());
    RootObj.insert("GPSInfoColor",SiteColors::GPSInfoColor.name());
    RootObj.insert("ImageDescriptionColor",SiteColors::ImageDescriptionColor.name());

    QJsonArray FolderColors;


    for(const auto value:SiteColors::FolderColors)
    {
        FolderColors.append(QJsonValue(value.name()));
    }
    RootObj.insert("FolderColors",FolderColors);


	RootObj.insert("N",AlbumName);
	RootObj.insert("D",Description);
	RootObj.insert("IS",SlideSize);
	RootObj.insert("IQ",SlideQuality);
	RootObj.insert("TS",ThumbSize);
	RootObj.insert("TQ",ThumbQuality);
	RootObj.insert("P",isPrivate);
	RootObj.insert("V",PhotoAlbumVersion);

	QJsonArray JsonFolders;
	for (int32_t i=0;i<ui->FoldersTreeWidget->topLevelItemCount();i++)
	{
		const AlbumTreeItem * RootFolder= dynamic_cast<AlbumTreeItem*>(ui->FoldersTreeWidget->topLevelItem(i));
		FolderToJson(JsonFolders,RootFolder,0);
	}
	RootObj.insert("TIC",TotalImages);
	RootObj.insert("TVC",TotalVideos);
	RootObj.insert("LC",QDate::currentDate().toString("dd.MM.yyyy"));

	RootObj.insert("F",JsonFolders);


	const QByteArray bytes=QJsonDocument(RootObj).toJson(QJsonDocument::Compact);

	const QString FileName=QDir(SitePath).filePath("Site.json");
	QFile File(FileName);

	if (!File.open(QIODeviceBase::ReadWrite))
	{
		QMessageBox::critical(this,"","Error opening Site.json for write");
		return;
	}
	if (File.write(bytes)==-1)
	{
		QMessageBox::critical(this,"","Error writing to Site.json");
		File.close();
		return;
	}
	hasUnsavedChanges=false;
	File.close();
	return;
}

void MainWindow::CloseSite()
{
	if (hasUnsavedChanges) SaveSiteData();
	setWindowTitle("PhotoAlbum Maker");
	ui->ImagesListWidget->clear();
	ui->VideosListWidget->clear();
	AlbumFolders.clear();
	CurrentFolderImages.clear();
    for(const AlbumTreeItem* Item : std::as_const(AlbumFolders))
	{
		for(int i=0;i<Item->Info->ImagesList.count();i++) delete Item->Info->ImagesList[i];
		for(int i=0;i<Item->Info->VideosList.count();i++) delete Item->Info->VideosList[i];
		delete Item->Info;
	}
	ui->FoldersTreeWidget->clear();
	CurrentFolderID=0;
	LastFolderID=0;
}

void MainWindow::FolderToJson(QJsonArray &FoldersArray, const AlbumTreeItem *Folder, const int32_t ParentFolderID)
{
	QJsonObject FolderObj;
	FolderInfo * FI=Folder->Info;
	FolderObj.insert("I",FI->FolderID);
	FolderObj.insert("N",FI->FolderName);
	FolderObj.insert("PI",ParentFolderID);
	FolderObj.insert("TF",FI->ThumbFolderID);
	FolderObj.insert("TN",FI->ThumbName);
	if (!FI->Comments.isEmpty()) FolderObj.insert("C",FI->Comments);
	{
		QJsonArray ImgArray;
		for (int32_t i=0;i<FI->ImagesList.count();i++)
		{
			QJsonObject ImageObj;
			ImageObj.insert("N",FI->ImagesList[i]->Name);
			if (!FI->ImagesList[i]->Comments.isEmpty()) ImageObj.insert("C",FI->ImagesList[i]->Comments);
			if (!FI->ImagesList[i]->Datetime.isEmpty()) ImageObj.insert("D",FI->ImagesList[i]->Datetime);
			if (!FI->ImagesList[i]->CameraName.isEmpty()) ImageObj.insert("Cn",FI->ImagesList[i]->CameraName);
			if (FI->ImagesList[i]->ISO!=0) ImageObj.insert("I",FI->ImagesList[i]->ISO);
			if (FI->ImagesList[i]->FocalLength!=0) ImageObj.insert("F",FI->ImagesList[i]->FocalLength);
			if (!FI->ImagesList[i]->Exposure.isEmpty()) ImageObj.insert("E",FI->ImagesList[i]->Exposure);
			if (!FI->ImagesList[i]->Aperture.isEmpty()) ImageObj.insert("A",FI->ImagesList[i]->Aperture);
			if (FI->ImagesList[i]->Latitide!=0) ImageObj.insert("La",FI->ImagesList[i]->Latitide);
			if (FI->ImagesList[i]->Longtitude!=0) ImageObj.insert("Lo",FI->ImagesList[i]->Longtitude);
			if (FI->ImagesList[i]->Altitude!=0) ImageObj.insert("Al",FI->ImagesList[i]->Altitude);

			ImgArray.append(ImageObj);
			++TotalImages;
		}
		FolderObj.insert("Im",ImgArray);
	}

	QJsonArray VideosArray;
	for (int32_t i=0;i<FI->VideosList.count();i++)
	{
		QJsonObject VideoObj;
		VideoObj.insert("N",FI->VideosList[i]->Name);
		VideoObj.insert("D",FI->VideosList[i]->Description);
		VideosArray.append(VideoObj);
		++TotalVideos;
	}
	FolderObj.insert("V",VideosArray);

	FoldersArray.append(FolderObj);

	for(int32_t i=0;i<Folder->childCount();i++)
	{
		FolderToJson(FoldersArray, dynamic_cast<AlbumTreeItem*>(Folder->child(i)),FI->FolderID);
	}



}

void MainWindow::onFolderThumbLoaded(const int FolderID,void * ImgPtr) const
{
	AlbumTreeItem * Folder=AlbumFolders.value(FolderID,nullptr);
	if (Folder!=nullptr)
	{
		if (ImgPtr!=nullptr)
		{
			const QImage * Img=static_cast<QImage*>(ImgPtr);
			Folder->setIcon(0,QIcon(QPixmap::fromImage(*Img)));
			delete Img;
		}
		else
			Folder->setIcon(0,QIcon(":/icons/icons/no-image.svg"));
	}
}

void MainWindow::onFolderMoved(const QModelIndex &parent, const int first, const int last)
{
	Q_UNUSED(parent);
	Q_UNUSED(first);
	Q_UNUSED(last);
    if (AllFoldersExpanded) ui->FoldersTreeWidget->expandAll();
	StartSaving();
}

void MainWindow::onImageMoved(const QModelIndex &parent, const int start, const int end, const QModelIndex &destination, const int row)
{
	Q_UNUSED(parent);
	Q_UNUSED(start);
	Q_UNUSED(end);
	Q_UNUSED(destination);
	Q_UNUSED(row);

	SaveImagesOrder();

}

void MainWindow::SaveImagesOrder()
{

	FolderInfo * FI=AlbumFolders[CurrentFolderID]->Info;
	FI->ImagesList.clear();

	for (int i=0;i<ui->ImagesListWidget->count();i++)
	{
		QListWidgetItem * Item=ui->ImagesListWidget->item(i);
		ImageInfo * Info= dynamic_cast<ImageThumbWidget*>(ui->ImagesListWidget->itemWidget(Item))->ImgInfo;

		FI->ImagesList.append(Info);
	}
	hasUnsavedChanges=true;
	StartSaving();
}

void MainWindow::onVideoMoved(const QModelIndex &parent, const int start, const int end, const QModelIndex &destination, const int row)
{
	Q_UNUSED(parent);
	Q_UNUSED(start);
	Q_UNUSED(end);
	Q_UNUSED(destination);
	Q_UNUSED(row);

	SaveVideosOrder();
}

void MainWindow::SaveVideosOrder()
{
	FolderInfo * FI=AlbumFolders[CurrentFolderID]->Info;
	FI->VideosList.clear();

	for (int i=0;i<ui->VideosListWidget->count();i++)
	{
		QListWidgetItem * Item=ui->VideosListWidget->item(i);
		VideoInfo * Info= dynamic_cast<VideoThumbWidget*>(ui->VideosListWidget->itemWidget(Item))->VidInfo;
		FI->VideosList.append(Info);
	}
	hasUnsavedChanges=true;
	StartSaving();

}

bool MainWindow::CopySiteContent() const
{
	bool result=true;

	const QDir TargetDir(SitePath);
    QFile::setPermissions(TargetDir.filePath("index.html"),QFile::ReadOther | QFile::WriteOther);
	QFile::remove(TargetDir.filePath("index.html"));
    result=result && QFile::copy(":/website/WebsiteContent/index.html",TargetDir.filePath("index.html"));



	TargetDir.mkpath("Scripts");
	TargetDir.mkpath("Content");
	TargetDir.mkpath("Images");
	TargetDir.mkpath("fonts");
	TargetDir.mkpath("Videos");



    QFile::setPermissions(TargetDir.filePath("Scripts/photoalbum-bundle.min.js"),QFile::ReadOther | QFile::WriteOther);
    QFile::remove(TargetDir.filePath("Scripts/photoalbum-bundle.min.js"));
    result=result && QFile::copy(":/website/WebsiteContent/photoalbum-bundle.min.js",TargetDir.filePath("Scripts/photoalbum-bundle.min.js"));


    QFile::setPermissions(TargetDir.filePath("Content/photogallery-bundle.min.css"),QFile::ReadOther | QFile::WriteOther);
	QFile::remove(TargetDir.filePath("Content/photogallery-bundle.min.css"));
	result=result && QFile::copy(":/website/WebsiteContent/photogallery-bundle.min.css",TargetDir.filePath("Content/photogallery-bundle.min.css"));


	QFile::copy(":/website/WebsiteContent/Video.png",TargetDir.filePath("Content/Video.png"));
	QFile::copy(":/website/WebsiteContent/loading.gif",TargetDir.filePath("Images/loading.gif"));
	QFile::copy(":/website/WebsiteContent/lg.svg",TargetDir.filePath("fonts/lg.svg"));
	QFile::copy(":/website/WebsiteContent/lg.ttf",TargetDir.filePath("fonts/lg.ttf"));
	QFile::copy(":/website/WebsiteContent/lg.woff",TargetDir.filePath("fonts/lg.woff"));
	QFile::copy(":/website/WebsiteContent/lg.woff2",TargetDir.filePath("fonts/lg.woff2"));


	return result;
}

bool MainWindow::MakeSlideAndThumb(const ImageInfo * Img, const bool MakeSlide, const bool MakeThumb) const
{
	bool result=true;
	QImageReader Reader(GetOriginalFileName(Img->FolderID,Img->Name));
	QImageReader::setAllocationLimit(256000000);
	QImage OriginalImg;
	Reader.read(&OriginalImg);

	if(OriginalImg.format()!=QImage::Format_RGB32)
		OriginalImg.convertTo(QImage::Format_RGB32,Qt::ColorOnly);

	if (OriginalImg.isNull()) return false;
	if (MakeSlide)
	{
		const QImage * SlideImage=ResizeImage::CreateSlide(&OriginalImg,SlideSize);
		const QString SlideFileName=GetSlideFileName(Img->FolderID,Img->Name);
		if (!SlideImage->save(SlideFileName,"JPG",SlideQuality)) result=false;
		delete SlideImage;
	}

	if (MakeThumb)
	{
		const QImage * ThumbImage=ResizeImage::CreateThumb(&OriginalImg,ThumbSize);
		const QString ThumbFileName=GetThumbFileName(Img->FolderID,Img->Name);
		if (!ThumbImage->save(ThumbFileName,"JPG",ThumbQuality)) result=false;
		delete ThumbImage;
	}
	return result;
}



void MainWindow::PrepareToAsyncJob(const int32_t ItemsToProcess, QString Message)
{
	ui->progressBar->setValue(0);
	ui->progressBar->setMaximum(ItemsToProcess);
	ui->ProgressTextLabel->setText(Message);
	ui->menubar->setEnabled(false);
	ui->ImagesListWidget->setEnabled(false);
	ui->FoldersTreeWidget->setEnabled(false);
	Progress=0;
	isAsyncJobRunning=true;
	QApplication::setOverrideCursor(Qt::WaitCursor);
}

void MainWindow::onProgressUpdate()
{
	++Progress;
	ui->progressBar->setValue(Progress);

	if (Progress>=ui->progressBar->maximum())
	{
		ui->progressBar->setVisible(false);
		ui->ProgressTextLabel->setText("");
		ui->menubar->setEnabled(true);
		ui->ImagesListWidget->setEnabled(true);
		ui->FoldersTreeWidget->setEnabled(true);
		QApplication::restoreOverrideCursor();
		isAsyncJobRunning=false;
		onFolderSelectionChanged(AlbumFolders[CurrentFolderID],nullptr); //reload images
		StartSaving();

	}


}


void MainWindow::RecreateSlidesAndThumbs(const bool MakeSlide, const bool MakeThumb)
{
	TotalImages=0;
    for(const AlbumTreeItem* Item : std::as_const(AlbumFolders))
	{
		TotalImages+=Item->Info->ImagesList.count();
	}

	PrepareToAsyncJob(TotalImages,"Recreating images thumbs and slides");

    for(const AlbumTreeItem* Item : std::as_const(AlbumFolders))
	{
		for (int32_t i=0;i<Item->Info->ImagesList.count();i++)
		{
			const ImageInfo * Info=Item->Info->ImagesList[i];
			static_cast<void>(QtConcurrent::run([Info, this, MakeSlide, MakeThumb]
			{
				MakeSlideAndThumb(Info,MakeSlide,MakeThumb);
				QMetaObject::invokeMethod(this,"onProgressUpdate",Qt::QueuedConnection);
			}));
		}
	}
}


void MainWindow::onAlbumSettingsEdit()
{
	SiteSettingsDialog Dlg(false,this);
	Dlg.exec();
}

void MainWindow::onNewAlbum()
{
	if (isSiteLoaded) CloseSite();
	SiteSettingsDialog Dlg(true,this);
	Dlg.exec();
}


void MainWindow::NewFolder(const QString& FolderName, const QString& FolderDescription, const int32_t ParentFolderID)
{
	++LastFolderID;
	const int32_t NewFolderID=LastFolderID;
	const QDir NewFolderDir(SitePath+"/"+QString::number(NewFolderID)+"/");
	if (!QDir::root().mkpath(NewFolderDir.absolutePath()))
	{
			QMessageBox::critical(this,"Error","Can't create new folder on disk");
			return;
	}
	NewFolderDir.mkdir("slides");
	NewFolderDir.mkdir("thumbs");


	FolderInfo * FI=new FolderInfo;
	FI->FolderID=NewFolderID;
	FI->FolderName=FolderName;
	FI->Comments=FolderDescription;
	FI->ParentFolderID=ParentFolderID;
	FI->ThumbFolderID=0;
	AlbumTreeItem *TreeItem=new AlbumTreeItem(FI);
	TreeItem->setIcon(0,QIcon(":/icons/icons/no-image.svg"));
	TreeItem->setText(0,FI->FolderName);
	TreeItem->setToolTip(0,FI->Comments);

	AlbumFolders.insert(NewFolderID,TreeItem);
	if (ParentFolderID==0)
	{
		ui->FoldersTreeWidget->addTopLevelItem(TreeItem);
		ui->FoldersTreeWidget->setCurrentItem(TreeItem);
	}

	else AlbumFolders.value(ParentFolderID)->addChild(TreeItem);
    if (AllFoldersExpanded) ui->FoldersTreeWidget->expandAll();
	UpdateActionsStatus();
    StartSaving();
}

void MainWindow::onNewRootFolder()
{
	EditFolderDialog Dlg(0,this);
	if (Dlg.exec()!=QDialog::Accepted) return;
	NewFolder(Dlg.ui->FolderNameEdit->text(),Dlg.ui->FolderDescriptionEdit->toPlainText(),0);

}


void MainWindow::onNewSubFolder(int32_t FolderID)
{
	if (FolderID==0) FolderID=CurrentFolderID;
	EditFolderDialog Dlg(0,this);
	if (Dlg.exec()!=QDialog::Accepted) return;
	NewFolder(Dlg.ui->FolderNameEdit->text(),Dlg.ui->FolderDescriptionEdit->toPlainText(),FolderID);
}

void MainWindow::onEditFolder(int32_t FolderID)
{
	if (FolderID==0) FolderID=CurrentFolderID;
	EditFolderDialog Dlg(FolderID,this);
	if (Dlg.exec()!=QDialog::Accepted) return;
	AlbumTreeItem * Folder =AlbumFolders.value(FolderID);
	Folder->Info->FolderName=Dlg.ui->FolderNameEdit->text();
	Folder->Info->Comments=Dlg.ui->FolderDescriptionEdit->toPlainText();
	Folder->setText(0,Folder->Info->FolderName);
	Folder->setToolTip(0,Folder->Info->Comments);
	StartSaving();
}

void MainWindow::onDeleteFolder(int32_t FolderID)
{
	if (FolderID==0) FolderID=CurrentFolderID;
	const AlbumTreeItem * TreeItem=AlbumFolders.value(FolderID);
	if (TreeItem->childCount()!=0)
	{
		QMessageBox::warning(this,"Cannot delete folder","Folder "+TreeItem->Info->FolderName+" contains subfolders. Move or delete subfolders first.");
		return;
	}
	QString DeleteQuestion="Are you sure to delete folder "+TreeItem->Info->FolderName+"?";
	if (!TreeItem->Info->ImagesList.isEmpty()||!TreeItem->Info->VideosList.isEmpty()) DeleteQuestion+="\nAll images and videos in this folder also will be deleted.";
	DeleteQuestion+="\nWARNING: this operation cannot be undone!";

	if (QMessageBox::question(this,"Delete folder",DeleteQuestion)!=QMessageBox::Yes) return;


	for(int i=0;i<TreeItem->Info->ImagesList.count();i++) delete TreeItem->Info->ImagesList[i];
	for(int i=0;i<TreeItem->Info->VideosList.count();i++)
	{
		DeleteVideoFile(TreeItem->Info->VideosList[i]);
		delete TreeItem->Info->VideosList[i];
	}
	QDir FolderDir(SitePath+"/"+QString::number(FolderID));
	FolderDir.removeRecursively();
	if (LastFolderID==TreeItem->Info->FolderID) --LastFolderID;
	delete TreeItem->Info;
	AlbumFolders.remove(FolderID);
	delete TreeItem;
        StartSaving();
	UpdateActionsStatus();
}

void MainWindow::onContextMenuNewFolder()
{
	const int32_t FolderID=ui->actionContextMenuAddFolder->data().toInt();
	if (FolderID==0) onNewRootFolder();
		else onNewSubFolder(FolderID);
}

void MainWindow::onContextMenuEditFolder()
{
	onEditFolder(ui->actionContextMenuEditFolder->data().toInt());
}


void MainWindow::onContextMenuDeleteFolder()
{
	onDeleteFolder(ui->actionContextMenuDeleteFolder->data().toInt());
}

void MainWindow::onExpandAllFolders()
{
    AllFoldersExpanded=true;
    ui->FoldersTreeWidget->expandAll();
}
void MainWindow::onCollapseAllFolders()
{
    AllFoldersExpanded=false;
    ui->FoldersTreeWidget->collapseAll();
}

void MainWindow::DeleteVideoFile(const VideoInfo* VidInfo) const
{
	const QDir VideosDir(SitePath+"/Videos/");
	QFile::remove(VideosDir.absoluteFilePath(VidInfo->Name));
	QFile::remove(VideosDir.absoluteFilePath("thumb_"+VidInfo->Name+".jpg"));

}

QString ExposureToString(const double Exposure)
{
	return (Exposure > 0.5)? QString::number(Exposure)
					: "1/" +QString::number(1/Exposure);

}

bool MainWindow::ReadExifData(ImageInfo* ImgInfo) const
{
	const QString ImgFileName=GetOriginalFileName(ImgInfo->FolderID,ImgInfo->Name);
	std::ifstream stream(ImgFileName.toStdString(), std::ios::binary);
	if (!stream) return false;

	const TinyEXIF::EXIFInfo imageEXIF(stream);
	if (!imageEXIF.Fields) return false;

	ImgInfo->CameraName="";
	if (!imageEXIF.Make.empty()) ImgInfo->CameraName+=QString::fromStdString(imageEXIF.Make);
	if (!imageEXIF.Model.empty()) ImgInfo->CameraName+=QString::fromStdString(" "+imageEXIF.Model);
	if (!imageEXIF.LensInfo.Make.empty() || !imageEXIF.LensInfo.Model.empty()) ImgInfo->CameraName+= QString::fromStdString(" "+imageEXIF.LensInfo.Make+" "+imageEXIF.LensInfo.Model);

	if(!imageEXIF.DateTimeOriginal.empty())
	{
		const QDateTime OrigTime=QDateTime::fromString(QString::fromStdString(imageEXIF.DateTimeOriginal),Qt::ISODate);
		ImgInfo->Datetime=OrigTime.toString("dd.MM.yyyy hh:mm");
	}
	else ImgInfo->Datetime="";


	ImgInfo->Aperture=(imageEXIF.FNumber!=0)? QString::number(imageEXIF.FNumber):"";
	ImgInfo->Exposure=(imageEXIF.ExposureTime!=0)? ExposureToString(imageEXIF.ExposureTime):"";
	ImgInfo->FocalLength=imageEXIF.FocalLength;
	ImgInfo->ISO=imageEXIF.ISOSpeedRatings;

	if (imageEXIF.GeoLocation.hasLatLon())
	{
		ImgInfo->Latitide=imageEXIF.GeoLocation.Latitude;
		ImgInfo->Longtitude=imageEXIF.GeoLocation.Longitude;
	}
	else
	{
		ImgInfo->Latitide=0;
		ImgInfo->Longtitude=0;
	}

	ImgInfo->Altitude=(imageEXIF.GeoLocation.hasAltitude())?round(imageEXIF.GeoLocation.Altitude):0;
	return true;
}


void MainWindow::onExifRescan()
{
	TotalImages=0;
    for(const AlbumTreeItem* Item : std::as_const(AlbumFolders))
	{
		TotalImages+=Item->Info->ImagesList.count();
	}

	PrepareToAsyncJob(TotalImages,"Rebuilding images EXIF info");


    for(const AlbumTreeItem* Item : std::as_const(AlbumFolders))
	{
		for (int32_t i=0;i<Item->Info->ImagesList.count();i++)
		{
			ImageInfo * Info=Item->Info->ImagesList[i];
			static_cast<void>(QtConcurrent::run([Info, this] {
				ReadExifData(Info);
				QMetaObject::invokeMethod(this,"onProgressUpdate",Qt::QueuedConnection);
			}));
		}
	}
}


void MainWindow::onAddImages()
{

	QStringList FileNamesToAdd=QFileDialog::getOpenFileNames(this,"Add images",	settings->value("imagespath","").toString(),"Images (*.jpg)");
	if (FileNamesToAdd.isEmpty()) return;
	QApplication::setOverrideCursor(Qt::WaitCursor);

	settings->setValue("imagespath",QFileInfo(FileNamesToAdd[0]).absolutePath());
	settings->sync();
	QMessageBox::StandardButton YesNoAll=QMessageBox::NoButton;

	QList<ImageInfo*> ImagesToProcess;
	FolderInfo * CurrentFolder=AlbumFolders.value(CurrentFolderID)->Info;

	ui->progressBar->setVisible(true);
	ui->progressBar->setValue(0);
	ui->progressBar->setMaximum(FileNamesToAdd.count());
	ui->ProgressTextLabel->setText("Adding images");

	for(int i=0;i<FileNamesToAdd.count();i++)
	{
		ui->progressBar->setValue(i);
		QString FileName=QFileInfo(FileNamesToAdd[i]).fileName();
		QString DestFileName=GetOriginalFileName(CurrentFolderID,FileName.toUpper());
		if (CurrentFolderImages.contains(FileName.toUpper())) //file already exists
		{
			if (YesNoAll==QMessageBox::NoToAll) continue;
			if (YesNoAll!=QMessageBox::YesToAll)
			{
				QApplication::restoreOverrideCursor();
				switch(QMessageBox::question(this,"Image already exists","Current folder already contains "+FileName+"\nOverwrite?",QMessageBox::Yes|QMessageBox::No|QMessageBox::YesToAll|QMessageBox::NoToAll))
				{
					case QMessageBox::NoToAll:
						YesNoAll=QMessageBox::NoToAll;
					case QMessageBox::No:
						continue;
					case QMessageBox::YesToAll:
						YesNoAll=QMessageBox::YesToAll;
					case QMessageBox::Yes:
						break;

					default:
						continue;
				}
				QApplication::setOverrideCursor(Qt::WaitCursor);
			}

			QFile::rename(DestFileName,DestFileName+".bak"); //temporary keep old version
			if (!QFile::copy(FileNamesToAdd[i],DestFileName))
			{
				//copy error, rename old version back
				QFile::rename(DestFileName+".bak",DestFileName);
				QMessageBox::critical(this,"File copying error","Can't copy "+FileNamesToAdd[i]+" - restoring previous version");
				continue;
			}
			QFile::remove(DestFileName+".bak");
			ImageInfo * ExistingImg=CurrentFolderImages.value(FileName.toUpper());
			ImagesToProcess.append(ExistingImg);

		}
		else
		{
			if (!QFile::copy(FileNamesToAdd[i],DestFileName))
			{
				QMessageBox::critical(this,"File copying error","Can't copy "+FileNamesToAdd[i]+", skipping");
				continue;
			}

			ImageInfo * NewImg=new ImageInfo();
			NewImg->Name=FileName;
			NewImg->FolderID=CurrentFolderID;
			CurrentFolder->ImagesList.append(NewImg);
			ImagesToProcess.append(NewImg);
			CurrentFolderImages.insert(FileName.toUpper(),NewImg);
		}


	}
	QApplication::restoreOverrideCursor();
	if (ImagesToProcess.count()==0)
	{
		ui->progressBar->setVisible(false);
		ui->ProgressTextLabel->setText("");
		return;
	}

	PrepareToAsyncJob(ImagesToProcess.count(),"Processing new images");


	for (int32_t i=0;i<ImagesToProcess.count();i++)
	{
		ImageInfo * Info=ImagesToProcess[i];
		static_cast<void>(QtConcurrent::run([Info, this]
		{
			ReadExifData(Info);
			MakeSlideAndThumb(Info,true,true);
			QMetaObject::invokeMethod(this,"onProgressUpdate",Qt::QueuedConnection);
		}));
	}



}

void MainWindow::onEditImageDescription()
{
	ImageInfo * Info= dynamic_cast<ImageThumbWidget*>(ui->ImagesListWidget->itemWidget(ui->ImagesListWidget->currentItem()))->ImgInfo;
	EditImageDescriptionDialog Dlg(Info, this);
    if (Dlg.exec()==QDialog::Accepted) StartSaving();
}

void MainWindow::onDeleteImages()
{
	if (QMessageBox::question(this,"Delete images","Are you sure to delete selected images?\n WARNING: this operation cannot be undone!")!=QMessageBox::Yes) return;


	for (int i=0;i<ui->ImagesListWidget->selectedItems().count();i++)
	{
		const ImageInfo * Info= dynamic_cast<ImageThumbWidget*>(ui->ImagesListWidget->itemWidget(ui->ImagesListWidget->selectedItems()[i]))->ImgInfo;
		QFile::remove(GetOriginalFileName(Info->FolderID,Info->Name));
		QFile::remove(GetSlideFileName(Info->FolderID,Info->Name));
		QFile::remove(GetThumbFileName(Info->FolderID,Info->Name));
        for(const AlbumTreeItem* Item : std::as_const(AlbumFolders)) //check if image used as folder thumbnail
		{
			if ((Item->Info->ThumbFolderID==Info->FolderID)&&(Item->Info->ThumbName==Info->Name))
			{
				Item->Info->ThumbFolderID=0;
				Item->Info->ThumbName="";
				LoadFolderThumb(Item->Info);
			}
		}

		CurrentFolderImages.remove(Info->Name);
		delete Info;

	}
	qDeleteAll(ui->ImagesListWidget->selectedItems());
	SaveImagesOrder();
	onFolderSelectionChanged(ui->FoldersTreeWidget->currentItem(),nullptr);	//todo
}

void MainWindow::onSetImageAsThumb()
{
	ImageInfo * Info= dynamic_cast<ImageThumbWidget*>(ui->ImagesListWidget->itemWidget(ui->ImagesListWidget->currentItem()))->ImgInfo;
	SetFolderThumbDialog Dlg(Info, this);
	Dlg.exec();

}


void MainWindow::onAddVideo()
{
	const QString OriginalFileName=QFileDialog::getOpenFileName(this,"Add video",settings->value("videospath","").toString(),"Videos (*.mp4)");
	if (OriginalFileName.isNull()||OriginalFileName.isEmpty()) return;

	QApplication::setOverrideCursor(Qt::WaitCursor);

	settings->setValue("videospath",QFileInfo(OriginalFileName).absolutePath());
	settings->sync();
	const QString FileName=QFileInfo(OriginalFileName).fileName();
	if (QFile::exists(SitePath+"/Videos/"+FileName))
	{
		QMessageBox::warning(this,"Error","File "+FileName+" already exists. Remove existing video or rename new one first.");
		return;
	}
	if (!QFile::copy(OriginalFileName,SitePath+"/Videos/"+FileName))
	{
		QMessageBox::critical(this,"Error","Can't copy "+OriginalFileName);
		return;
	}

	VideoInfo * Info=new VideoInfo;
	Info->FolderID=CurrentFolderID;
	Info->Name=FileName;
	Info->Description=FileName;

	AlbumFolders.value(CurrentFolderID)->Info->VideosList.append(Info);
	QListWidgetItem *WI=new QListWidgetItem(ui->VideosListWidget);
	VideoThumbWidget *Widget=new VideoThumbWidget(Info);
	WI->setSizeHint(Widget->sizeHint());
	ui->VideosListWidget->addItem(WI);
	ui->VideosListWidget->setItemWidget(WI,Widget);
	QApplication::restoreOverrideCursor();
	EditVideoDialog Dlg(Info, this);
	if (Dlg.exec()==QDialog::Accepted)
	{
		Widget->Update();
	}
	StartSaving();
    onFolderSelectionChanged(ui->FoldersTreeWidget->currentItem(),nullptr);
}

void MainWindow::onEditVideo()
{
	const VideoThumbWidget * Widget=dynamic_cast<VideoThumbWidget*>(ui->VideosListWidget->itemWidget(ui->VideosListWidget->currentItem()));
	VideoInfo * Info=Widget->VidInfo;
	EditVideoDialog Dlg(Info, this);
	if (Dlg.exec()==QDialog::Accepted)
	{
		Widget->Update();
		StartSaving();
	}

}

void MainWindow::onDeleteVideo()
{
	if (QMessageBox::question(this,"Delete videos","Are you sure to delete selected videos?\n WARNING: this operation cannot be undone!")!=QMessageBox::Yes) return;

	for (int i=0;i<ui->VideosListWidget->selectedItems().count();i++)
		{
			const VideoInfo * Info= dynamic_cast<VideoThumbWidget*>(ui->VideosListWidget->itemWidget(ui->VideosListWidget->selectedItems()[i]))->VidInfo;
			QFile::remove(SitePath+"/Videos/thumb_"+Info->Name+".jpg");
			QFile::remove(SitePath+"/Videos/"+Info->Name);
			delete Info;

		}
		qDeleteAll(ui->VideosListWidget->selectedItems());
		SaveVideosOrder();
		onFolderSelectionChanged(ui->FoldersTreeWidget->currentItem(),nullptr);

}

void MainWindow::onAbout()
{
	AboutDialog Dlg(this);
	Dlg.exec();
}

void MainWindow::onEditColors()
{
    EditColorsDialog Dlg(this);
    if (Dlg.exec()==QDialog::Accepted) StartSaving();
}


