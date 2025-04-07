#include "clickablelabel.h"
#include <QColorDialog>

ClickableLabel::ClickableLabel(QWidget *parent): QLabel(parent)
{

}


void ClickableLabel::SetColor(const QColor NewColor)
{
    LabelColor=NewColor;
    setStyleSheet("color: "+LabelColor.name());
}

void ClickableLabel::mouseDoubleClickEvent(QMouseEvent *event)
{
    QColorDialog Dlg(LabelColor);
    Dlg.setOption(QColorDialog::DontUseNativeDialog,true);
    Dlg.setWindowTitle("Edit Font Color");
    if (Dlg.exec()==QDialog::Accepted)
    {
        SetColor(Dlg.selectedColor());
        emit ColorChanged(LabelColor);
    }
}
