#ifndef CLICKABLELABEL_H
#define CLICKABLELABEL_H

#include <QLabel>

class ClickableLabel : public QLabel
{
    Q_OBJECT
public:
    ClickableLabel(QWidget *parent = nullptr);
    QColor LabelColor;
    void SetColor (QColor NewColor);

signals:
    void ColorChanged(QColor NewColor);

private:
    void mouseDoubleClickEvent(QMouseEvent *event) override;
};

#endif // CLICKABLELABEL_H
