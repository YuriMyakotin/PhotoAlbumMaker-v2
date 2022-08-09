#include "editimagedescriptiondialog.h"
#include "ui_editimagedescriptiondialog.h"
#include "mainwindow.h"
#include "resizeimage.h"

EditImageDescriptionDialog::EditImageDescriptionDialog(ImageInfo * Info,QWidget *parent) :
	QDialog(parent),
	ui(new Ui::EditImageDescriptionDialog)
{
	ui->setupUi(this);
	ui->buttonBox->layout()->setSpacing(0);
	this->ImgInfo=Info;

	ui->NameLabel->setText(Info->Name);
	const QImage ThumbImage(MainWindow::MainWindowPtr->GetThumbFileName(Info->FolderID,Info->Name));
	const QImage * ResizedImg=ResizeImage::Resize(&ThumbImage,ui->PictureLabel->width(),ui->PictureLabel->width());
	ui->PictureLabel->setPixmap(QPixmap().fromImage(*ResizedImg));
	delete ResizedImg;
	ui->DescriptionTextEdit->setPlainText(Info->Comments);
	connect(ui->buttonBox,&QDialogButtonBox::accepted,this,&EditImageDescriptionDialog::onAccept);

}

EditImageDescriptionDialog::~EditImageDescriptionDialog()
{
	delete ui;
}

void EditImageDescriptionDialog::onAccept()
{
	if (ImgInfo->Comments!=ui->DescriptionTextEdit->toPlainText())
	{
		ImgInfo->Comments=ui->DescriptionTextEdit->toPlainText();
		MainWindow::MainWindowPtr->StartSaving();
	}
	accept();
}
