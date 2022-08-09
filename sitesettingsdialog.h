#ifndef SITESETTINGSDIALOG_H
#define SITESETTINGSDIALOG_H

#include <QDialog>

namespace Ui {
	class SiteSettingsDialog;
}

class SiteSettingsDialog : public QDialog
{
	Q_OBJECT

public:
	explicit SiteSettingsDialog(bool isNew=true,QWidget *parent = nullptr);
	~SiteSettingsDialog() override;
	Ui::SiteSettingsDialog *ui;
	bool isNew;
public slots:
	void onAcceptPressed();
	void onBrowsePressed();


};

#endif // SITESETTINGSDIALOG_H
