#ifndef EDITFOLDERDIALOG_H
#define EDITFOLDERDIALOG_H

#include <QDialog>

namespace Ui {
	class EditFolderDialog;
}

class EditFolderDialog : public QDialog
{
	Q_OBJECT

public:
	explicit EditFolderDialog(int32_t FolderID,QWidget *parent = nullptr);
	~EditFolderDialog() override;
	Ui::EditFolderDialog *ui;
public slots:
	void onAcceptPressed();

};

#endif // EDITFOLDERDIALOG_H
