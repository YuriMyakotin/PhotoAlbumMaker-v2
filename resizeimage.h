#ifndef RESIZEIMAGE_H
#define RESIZEIMAGE_H

#include <QImage>


class ResizeImage
{
public:
	static QImage * Resize(const QImage * OriginalImage, const int32_t Width, const int32_t Height);
	static QImage * CreateSlide(const QImage * OriginalImage, const int32_t MaxSize);
	static QImage * CreateThumb(const QImage * OriginalImage, const int32_t MaxSize);
};

#endif // RESIZEIMAGE_H
