#ifndef EDITCOLORSDIALOG_H
#define EDITCOLORSDIALOG_H

#include <QDialog>
#include <QMenu>
#include <QAbstractButton>

namespace Ui {
class EditColorsDialog;
}

class EditColorsDialog : public QDialog
{
    Q_OBJECT

public:
    explicit EditColorsDialog(QWidget *parent = nullptr);
    ~EditColorsDialog() override;
    QColor BgColor;
    QColor FolderNameColor;
    QColor VideoNameColor;
    void AddFolderWidget(QColor Color,int Row=-1);
  

public slots:
    void onFolderNameColorChanged(QColor Color);
    void onVideoNameColorChanged(QColor Color);

    void onNewFolder();
    void onChangeFolderColor() const;
    void onDeleteFolder() const;
    void onAccept();
    void onBtnClick(QAbstractButton* button);


private:
    QMenu FoldersContextMenu;
    Ui::EditColorsDialog *ui;
    void mouseDoubleClickEvent(QMouseEvent *event) override;
    void onFolderContextMenuRequested(const QPoint &pos);
};

#endif // EDITCOLORSDIALOG_H
