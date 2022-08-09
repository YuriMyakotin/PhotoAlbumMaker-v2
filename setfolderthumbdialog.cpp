#include "setfolderthumbdialog.h"
#include "ui_setfolderthumbdialog.h"
#include "mainwindow.h"
#include "resizeimage.h"


SetFolderThumbDialog::SetFolderThumbDialog(ImageInfo * Info, QWidget *parent) :
	QDialog(parent),
	ui(new Ui::SetFolderThumbDialog)
{
	ui->setupUi(this);
	ui->buttonBox->layout()->setSpacing(0);
	this->ImgInfo=Info;

	ui->NameLabel->setText(Info->Name);
	const QImage ThumbImage(MainWindow::MainWindowPtr->GetThumbFileName(Info->FolderID,Info->Name));
	const QImage * ResizedImg=ResizeImage::Resize(&ThumbImage,ui->PictureLabel->width(),ui->PictureLabel->width());
	ui->PictureLabel->setPixmap(QPixmap().fromImage(*ResizedImg));
	delete ResizedImg;
	ui->FoldersWidget->setIconSize(QSize(64,64));
	const FolderInfo * CurrentFolder=MainWindow::MainWindowPtr->AlbumFolders.value(Info->FolderID)->Info;
	Folders.insert(CurrentFolder->FolderID,CreateWidgetItem(CurrentFolder));
	while(CurrentFolder->ParentFolderID!=0)
	{
		CurrentFolder=MainWindow::MainWindowPtr->AlbumFolders.value(CurrentFolder->ParentFolderID)->Info;
		Folders.insert(CurrentFolder->FolderID,CreateWidgetItem(CurrentFolder));
	}
	for(QTreeWidgetItem * Item : qAsConst(Folders))
	{
		const int32_t FolderID=Item->data(0,Qt::UserRole).toInt();
		int32_t ParentID=MainWindow::MainWindowPtr->AlbumFolders.value(FolderID)->Info->ParentFolderID;
		if (ParentID==0) ui->FoldersWidget->addTopLevelItem(Item);
		else Folders.value(ParentID)->addChild(Item);

	}

	ui->FoldersWidget->expandAll();
	connect(ui->buttonBox,&QDialogButtonBox::accepted,this,&SetFolderThumbDialog::onAccept);
}

SetFolderThumbDialog::~SetFolderThumbDialog()
{
	delete ui;
}

QTreeWidgetItem * SetFolderThumbDialog::CreateWidgetItem(const FolderInfo * Info) const
{
	QTreeWidgetItem * NewFolderItem = new QTreeWidgetItem();
	NewFolderItem->setText(0,Info->FolderName);
	if ((ImgInfo->FolderID==Info->ThumbFolderID)&&(ImgInfo->Name==Info->ThumbName))
	{
		NewFolderItem->setCheckState(0,Qt::CheckState::Checked);
		NewFolderItem->setDisabled(true);
	}
	else NewFolderItem->setCheckState(0,Qt::CheckState::Unchecked);
	NewFolderItem->setData(0,Qt::UserRole,Info->FolderID);
	if ((Info->ThumbFolderID==0)||(Info->ThumbName.isEmpty()))
		NewFolderItem->setIcon(0,QIcon(":/icons/icons/no-image.svg"));
	else
	{
		const QImage FolderThumb(MainWindow::MainWindowPtr->GetThumbFileName(Info->ThumbFolderID,Info->ThumbName));
		const QImage * Resized=ResizeImage::Resize(&FolderThumb,64,64);
		NewFolderItem->setIcon(0,QIcon(QPixmap::fromImage(*Resized)));
		delete Resized;
	}
	return NewFolderItem;
}


void SetFolderThumbDialog::onAccept()
{
	bool isSaveNeed=false;
	for(const QTreeWidgetItem * Item : qAsConst(Folders))
	{
		if (Item->checkState(0)==Qt::CheckState::Checked)
		{
			isSaveNeed=true;
			const int32_t FolderID=Item->data(0,Qt::UserRole).toInt();
			FolderInfo * Info=MainWindow::MainWindowPtr->AlbumFolders.value(FolderID)->Info;
			Info->ThumbFolderID=ImgInfo->FolderID;
			Info->ThumbName=ImgInfo->Name;
			MainWindow::MainWindowPtr->LoadFolderThumb(Info);
		}
	}
	if (isSaveNeed) MainWindow::MainWindowPtr->StartSaving();
	accept();
}
