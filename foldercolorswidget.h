#ifndef FOLDERCOLORSWIDGET_H
#define FOLDERCOLORSWIDGET_H

#include <QWidget>

namespace Ui {
class FolderColorsWidget;
}

class FolderColorsWidget : public QWidget
{
    Q_OBJECT

public:
    explicit FolderColorsWidget(QColor NewColor, QWidget *parent = nullptr);
    ~FolderColorsWidget() override;
    QColor FolderColor;
    void SetFolderColor(QColor NewColor);
    void SetFolderNameColor(QColor NewColor) const;
    void SetVideoNameColor(QColor NewColor) const;
    Ui::FolderColorsWidget *ui;
    void mouseDoubleClickEvent(QMouseEvent *event) override;
private:

    void paintEvent(QPaintEvent* event) override;

};

#endif // FOLDERCOLORSWIDGET_H
