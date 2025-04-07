#include "sitesettingsdialog.h"
#include "ui_sitesettingsdialog.h"
#include "mainwindow.h"
#include <QFileDialog>
#include <QMessageBox>

SiteSettingsDialog::SiteSettingsDialog(const bool isNew,QWidget *parent) :
	QDialog(parent),
	ui(new Ui::SiteSettingsDialog)
{
	ui->setupUi(this);
	this->isNew=isNew;
	ui->buttonBox->layout()->setSpacing(0);

	if (!isNew)
	{
		ui->BrowseButton->setEnabled(false);
		ui->FilesPathEdit->setEnabled(false);

		ui->FilesPathEdit->setText(MainWindow::MainWindowPtr->SitePath);
		ui->AlbumNameEdit->setText(MainWindow::MainWindowPtr->AlbumName);
		ui->AlbumDescriptionEdit->setText(MainWindow::MainWindowPtr->Description);
		ui->SlideSizeSpinBox->setValue(MainWindow::MainWindowPtr->SlideSize);
		ui->SlideQualitySpinBox->setValue(MainWindow::MainWindowPtr->SlideQuality);
		ui->ThumbSizeSpinBox->setValue(MainWindow::MainWindowPtr->ThumbSize);
		ui->ThumbQualitySpinBox->setValue(MainWindow::MainWindowPtr->ThumbQuality);
		ui->isPrivateSiteCheckBox->setChecked(MainWindow::MainWindowPtr->isPrivate);
	}
	else
	{
		connect(ui->BrowseButton,&QPushButton::clicked,this,&SiteSettingsDialog::onBrowsePressed);
	}

	connect(ui->buttonBox,&QDialogButtonBox::accepted,this,&SiteSettingsDialog::onAcceptPressed);
}

SiteSettingsDialog::~SiteSettingsDialog()
{
	delete ui;
}

void SiteSettingsDialog::onBrowsePressed()
{
	ui->FilesPathEdit->setText(QFileDialog::getExistingDirectory(this,"Select folder for new PhotoAlbum",""));
}

void SiteSettingsDialog::onAcceptPressed()
{
	if (isNew&&(ui->FilesPathEdit->text().isEmpty()))
	{
		QMessageBox::warning(this,"Error","You must select existing folder for creating PhotoAlbum");
		return;
	}

	if (ui->AlbumNameEdit->text().isEmpty())
	{
		QMessageBox::warning(this,"Error","PhotoAlbum Name field cannot be empty");
		return;
	}
	MainWindow::MainWindowPtr->AlbumName=ui->AlbumNameEdit->text();
	MainWindow::MainWindowPtr->setWindowTitle("PhotoAlbum Maker - "+ui->AlbumNameEdit->text());
	MainWindow::MainWindowPtr->Description=ui->AlbumDescriptionEdit->toPlainText();
	MainWindow::MainWindowPtr->isPrivate=ui->isPrivateSiteCheckBox->isChecked();
	if (isNew)
	{
		MainWindow::MainWindowPtr->SitePath=ui->FilesPathEdit->text();
		MainWindow::MainWindowPtr->SlideSize=ui->SlideSizeSpinBox->value();
		MainWindow::MainWindowPtr->SlideQuality=ui->SlideQualitySpinBox->value();
		MainWindow::MainWindowPtr->ThumbSize=ui->ThumbSizeSpinBox->value();
		MainWindow::MainWindowPtr->ThumbQuality=ui->ThumbQualitySpinBox->value();
		MainWindow::MainWindowPtr->isSiteLoaded=true;
		if (!MainWindow::MainWindowPtr->CopySiteContent())
		{
			QMessageBox::critical(this,"Error","Can't copy required PhotoAlbum files");
			MainWindow::MainWindowPtr->CloseSite();
			return;
		}

		MainWindow::MainWindowPtr->settings->setValue("sitepath",MainWindow::MainWindowPtr->SitePath);
		MainWindow::MainWindowPtr->settings->sync();
		MainWindow::MainWindowPtr->UpdateActionsStatus();
		MainWindow::MainWindowPtr->StartSaving();
		MainWindow::MainWindowPtr->ConnectFolderTreeWidget();
	}
	else
	{
		const bool isSlidesSettingsChanged=(ui->SlideSizeSpinBox->value()!=MainWindow::MainWindowPtr->SlideSize)||(ui->SlideQualitySpinBox->value()!=MainWindow::MainWindowPtr->SlideQuality);
		const bool isThumbsSettingsChanged=(ui->ThumbSizeSpinBox->value()!=MainWindow::MainWindowPtr->ThumbSize)||(ui->ThumbQualitySpinBox->value()!=MainWindow::MainWindowPtr->ThumbQuality);
		if (isSlidesSettingsChanged||isThumbsSettingsChanged)
		{
			if (QMessageBox::question(this,"","WARNING: you changing images size or quality settings on existing PhotoAlbum.\nRebuilding all slides and thumbs images with new settings can take long time. Proceed?")!=QMessageBox::Yes) return;
			MainWindow::MainWindowPtr->SlideSize=ui->SlideSizeSpinBox->value();
			MainWindow::MainWindowPtr->SlideQuality=ui->SlideQualitySpinBox->value();
			MainWindow::MainWindowPtr->ThumbSize=ui->ThumbSizeSpinBox->value();
			MainWindow::MainWindowPtr->ThumbQuality=ui->ThumbQualitySpinBox->value();
			MainWindow::MainWindowPtr->RecreateSlidesAndThumbs(isSlidesSettingsChanged,isThumbsSettingsChanged);
		}
		else MainWindow::MainWindowPtr->StartSaving();
	}


	QDialog::accept();
}
