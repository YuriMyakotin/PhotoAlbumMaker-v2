#include "foldercolorswidget.h"
#include <QStyleOption>
#include <QPainter>
#include "ui_foldercolorswidget.h"
#include <QColorDialog>

FolderColorsWidget::FolderColorsWidget(const QColor NewColor,
                                       QWidget *parent)
    : QWidget(parent)
    , ui(new Ui::FolderColorsWidget)
{
    ui->setupUi(this);
    SetFolderColor(NewColor);
}

FolderColorsWidget::~FolderColorsWidget()
{
    delete ui;
}

void FolderColorsWidget::SetFolderColor(const QColor NewColor)
{
    FolderColor=NewColor;
    setStyleSheet("background-color: "+FolderColor.name(QColor::HexRgb));
}

void FolderColorsWidget::paintEvent(QPaintEvent* event)
{
    QStyleOption opt;
    opt.initFrom(this);
    QPainter p(this);
    style()->drawPrimitive(QStyle::PE_Widget, &opt, &p, this);
    QWidget::paintEvent(event);
}

void FolderColorsWidget::SetFolderNameColor(const QColor NewColor) const
{
    ui->FolderNameLabel->SetColor(NewColor);
}

void FolderColorsWidget::SetVideoNameColor(const QColor NewColor) const
{
    ui->VideoNameLabel->SetColor(NewColor);
}

void FolderColorsWidget::mouseDoubleClickEvent(QMouseEvent *event)
{
    QColorDialog Dlg(FolderColor);
    Dlg.setWindowTitle("Edit Folder Background Color");
    Dlg.setOption(QColorDialog::DontUseNativeDialog,true);
    if (Dlg.exec()==QDialog::Accepted) SetFolderColor(Dlg.selectedColor());
}
