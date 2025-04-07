#ifndef EDITIMAGEDESCRIPTIONDIALOG_H
#define EDITIMAGEDESCRIPTIONDIALOG_H

#include <QDialog>
#include "PhotoAlbumData.h"

namespace Ui {
	class EditImageDescriptionDialog;
}

class EditImageDescriptionDialog : public QDialog
{
	Q_OBJECT

public:
	explicit EditImageDescriptionDialog(ImageInfo * Info, QWidget *parent = nullptr);
	~EditImageDescriptionDialog() override;
public slots:
	void onAccept();

private:
	ImageInfo * ImgInfo;
	Ui::EditImageDescriptionDialog *ui;
};

#endif // EDITIMAGEDESCRIPTIONDIALOG_H
