#ifndef SETFOLDERTHUMBDIALOG_H
#define SETFOLDERTHUMBDIALOG_H

#include <QDialog>
#include <QMap>
#include <PhotoAlbumData.h>

namespace Ui {
	class SetFolderThumbDialog;
}

class SetFolderThumbDialog final : public QDialog
{
	Q_OBJECT

public:
	explicit SetFolderThumbDialog(ImageInfo * Info, QWidget *parent = nullptr);
	~SetFolderThumbDialog() override;
public slots:
	void onAccept();

private:
	ImageInfo * ImgInfo;
	Ui::SetFolderThumbDialog *ui;
	QMap<int32_t,QTreeWidgetItem *> Folders;
	QTreeWidgetItem *CreateWidgetItem(const FolderInfo * Info) const;
};

#endif // SETFOLDERTHUMBDIALOG_H
