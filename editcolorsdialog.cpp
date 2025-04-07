#include "editcolorsdialog.h"
#include "ui_editcolorsdialog.h"
#include "foldercolorswidget.h"
#include "sitecolors.h"
#include "ui_foldercolorswidget.h"
#include <QColorDialog>

EditColorsDialog::EditColorsDialog(QWidget *parent)
    : QDialog(parent)
    , ui(new Ui::EditColorsDialog)
{
    ui->setupUi(this);
    ui->FolderColorsListWidget->clear();

    BgColor=SiteColors::BgColor;
    setStyleSheet("background-color: "+BgColor.name(QColor::HexRgb));
    ui->buttonBox->setStyleSheet("background-color: 0xD0D0D0");

    ui->NavBarFolderLinkLabel->SetColor(SiteColors::NavBarLinkColor);
    ui->NavBarCurrentFolderLabel->SetColor(SiteColors::NavBarCurrentFolderNameColor);
    ui->FolderDescriptionLabel->SetColor(SiteColors::FolderDescriptionColor);
    ui->ImageDescriptionLabel->SetColor(SiteColors::ImageDescriptionColor);
    ui->ImageNameLabel->SetColor(SiteColors::ImageNameColor);
    ui->ExifInfoLabel->SetColor(SiteColors::ExifInfoColor);
    ui->GPSInfoLabel->SetColor(SiteColors::GPSInfoColor);
    ui->SiteInfoLabel->SetColor(SiteColors::BottomInfoBarColor);



    FolderNameColor=SiteColors::FolderNameColor;
    VideoNameColor=SiteColors::VideoNameColor;
    for (const QColor &clr:SiteColors::FolderColors)
    {
        AddFolderWidget(clr);
    }


    FoldersContextMenu.addAction(ui->actionNew_Folder_Color);
    FoldersContextMenu.addAction(ui->actionChange_Color);
    FoldersContextMenu.addAction(ui->actionDelete);

    connect(ui->FolderColorsListWidget,&QListWidget::customContextMenuRequested,this,&EditColorsDialog::onFolderContextMenuRequested);
    connect(ui->actionChange_Color,&QAction::triggered,this,&EditColorsDialog::onChangeFolderColor);
    connect(ui->actionNew_Folder_Color,&QAction::triggered,this,&EditColorsDialog::onNewFolder);
    connect(ui->actionDelete,&QAction::triggered,this,&EditColorsDialog::onDeleteFolder);
    connect(ui->buttonBox,&QDialogButtonBox::accepted,this,&EditColorsDialog::onAccept);
    connect(ui->buttonBox,&QDialogButtonBox::clicked,this,&EditColorsDialog::onBtnClick);
}

EditColorsDialog::~EditColorsDialog()
{
    delete ui;
}

void EditColorsDialog::mouseDoubleClickEvent([[maybe_unused]]QMouseEvent *event)
{

    QColorDialog Dlg(BgColor);
    Dlg.setOption(QColorDialog::DontUseNativeDialog,true);
    Dlg.setWindowTitle("Edit Site Background Color");
    if (Dlg.exec()==QDialog::Accepted)
    {
        BgColor=Dlg.selectedColor();
        setStyleSheet("background-color: "+BgColor.name(QColor::HexRgb));
    }
}

void EditColorsDialog::AddFolderWidget(const QColor Color, const int Row)
{
    QListWidgetItem *WI=new QListWidgetItem(ui->FolderColorsListWidget);
    FolderColorsWidget* FCW=new FolderColorsWidget(Color);
    WI->setSizeHint(QSize(160,80));

    if (Row==-1) ui->FolderColorsListWidget->addItem(WI);
    else ui->FolderColorsListWidget->insertItem(Row,WI);

    FCW->SetFolderNameColor(FolderNameColor);
    FCW->SetVideoNameColor(VideoNameColor);

    ui->FolderColorsListWidget->setItemWidget(WI,FCW);

    connect(FCW->ui->FolderNameLabel,&ClickableLabel::ColorChanged,this,&EditColorsDialog::onFolderNameColorChanged);
    connect(FCW->ui->VideoNameLabel,&ClickableLabel::ColorChanged,this,&EditColorsDialog::onVideoNameColorChanged);
}

void EditColorsDialog::onFolderNameColorChanged(const QColor Color)
{
    FolderNameColor=Color;
    for (int i=0;i<ui->FolderColorsListWidget->count();i++)
	    dynamic_cast<FolderColorsWidget*>(ui->FolderColorsListWidget->itemWidget(ui->FolderColorsListWidget->item(i)))->SetFolderNameColor(Color);
}
void EditColorsDialog::onVideoNameColorChanged(const QColor Color)
{
    VideoNameColor=Color;
    for (int i=0;i<ui->FolderColorsListWidget->count();i++)
	    dynamic_cast<FolderColorsWidget*>(ui->FolderColorsListWidget->itemWidget(ui->FolderColorsListWidget->item(i)))->SetVideoNameColor(Color);
}


void EditColorsDialog::onFolderContextMenuRequested(const QPoint &pos)
{
	const QListWidgetItem * Item=ui->FolderColorsListWidget->itemAt(pos);
    int Row;
    if (Item==nullptr)
    {
        Row=-1;
        ui->actionChange_Color->setEnabled(false);
        ui->actionChange_Color->setVisible(false);
        ui->actionDelete->setEnabled(false);
        ui->actionDelete->setVisible(false);
    }
    else
    {
        Row=ui->FolderColorsListWidget->row(Item);
        ui->actionChange_Color->setEnabled(true);
        ui->actionChange_Color->setVisible(true);
        if (ui->FolderColorsListWidget->count()>2)
        {
            ui->actionDelete->setEnabled(true);
            ui->actionDelete->setVisible(true);
        }
        else
        {
            ui->actionDelete->setEnabled(false);
            ui->actionDelete->setVisible(false);
        }

    }
    ui->actionNew_Folder_Color->setData(Row);
    ui->actionChange_Color->setData(Row);
    ui->actionDelete->setData(Row);
    FoldersContextMenu.exec(mapToGlobal(pos));
}

void EditColorsDialog::onChangeFolderColor() const
{
	const int Row=ui->actionChange_Color->data().toInt();
    QListWidgetItem * Item=ui->FolderColorsListWidget->item(Row);
    if (Item==nullptr) return;
    dynamic_cast<FolderColorsWidget*>(ui->FolderColorsListWidget->itemWidget(Item))->mouseDoubleClickEvent(nullptr);
}

void EditColorsDialog::onDeleteFolder() const
{
	const int Row=ui->actionDelete->data().toInt();
	const QListWidgetItem * Item=ui->FolderColorsListWidget->takeItem(Row);
    delete Item;

}

void EditColorsDialog::onNewFolder()
{
	const int Row=ui->actionNew_Folder_Color->data().toInt();
    QColorDialog Dlg(QColor(128,128,128));
    Dlg.setWindowTitle("New Folder Background Color");
    Dlg.setOption(QColorDialog::DontUseNativeDialog,true);
    if (Dlg.exec()==QDialog::Accepted)
    {

        AddFolderWidget(Dlg.selectedColor(),Row);
    }
}

void EditColorsDialog::onAccept()
{
    SiteColors::FolderColors.clear();
    for (int i=0;i<ui->FolderColorsListWidget->count();i++)
        SiteColors::FolderColors.push_back(dynamic_cast<FolderColorsWidget*>(ui->FolderColorsListWidget->itemWidget(ui->FolderColorsListWidget->item(i)))->FolderColor);

    SiteColors::BgColor=BgColor;
    SiteColors::FolderNameColor=FolderNameColor;
    SiteColors::VideoNameColor=VideoNameColor;
    SiteColors::BottomInfoBarColor=ui->SiteInfoLabel->LabelColor;
    SiteColors::NavBarLinkColor=ui->NavBarFolderLinkLabel->LabelColor;
    SiteColors::NavBarCurrentFolderNameColor=ui->NavBarCurrentFolderLabel->LabelColor;
    SiteColors::FolderDescriptionColor=ui->FolderDescriptionLabel->LabelColor;
    SiteColors::ImageDescriptionColor=ui->ImageDescriptionLabel->LabelColor;
    SiteColors::ImageNameColor=ui->ImageNameLabel->LabelColor;
    SiteColors::ExifInfoColor=ui->ExifInfoLabel->LabelColor;
    SiteColors::GPSInfoColor=ui->GPSInfoLabel->LabelColor;
    accept();
}

void EditColorsDialog::onBtnClick(QAbstractButton* button)
{
    if (ui->buttonBox->buttonRole(button) == QDialogButtonBox::ButtonRole::ResetRole)
    {
        SiteColors::ResetColorsToDefault();
        accept();
    }
}
