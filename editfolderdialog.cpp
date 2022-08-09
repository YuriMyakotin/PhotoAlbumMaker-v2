#include "editfolderdialog.h"
#include "ui_editfolderdialog.h"
#include "mainwindow.h"
#include <QMessageBox>

EditFolderDialog::EditFolderDialog(int32_t FolderID,QWidget *parent) :
	QDialog(parent),
	ui(new Ui::EditFolderDialog)
{
	ui->setupUi(this);
	ui->buttonBox->layout()->setSpacing(0);
	if (FolderID!=0)
	{
		const FolderInfo * CurrentFolder=MainWindow::MainWindowPtr->AlbumFolders.value(FolderID)->Info;
		ui->FolderNameEdit->setText(CurrentFolder->FolderName);
		ui->FolderDescriptionEdit->setText(CurrentFolder->Comments);
	}
	else
	{
		setWindowTitle("New Folder");
	}
	connect(ui->buttonBox,&QDialogButtonBox::accepted,this,&EditFolderDialog::onAcceptPressed);

}

EditFolderDialog::~EditFolderDialog()
{
	delete ui;
}

void EditFolderDialog::onAcceptPressed()
{
	if (ui->FolderNameEdit->text().isEmpty())
	{
		QMessageBox::warning(this,"Error","Folder Name field cannot be empty");
		return;
	}

	accept();
}
