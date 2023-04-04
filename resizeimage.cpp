#include "resizeimage.h"
#include "avir.h"

#if defined (Q_OS_WIN)
#include "avir_float8_avx.h"
#endif

#include <QColorSpace>

QImage * ResizeImage::Resize(const QImage * OriginalImage, const int32_t Width, const int32_t Height)

{
	avir :: CImageResizerVars Vars;
	if (OriginalImage->colorSpace()==QColorSpace::SRgb)
	{
		Vars.UseSRGBGamma = true;
	}

#if defined (Q_OS_WIN)
	const avir :: CImageResizer< avir :: fpclass_float8_dil> ImageResizer( 8 );
#else
	const avir :: CImageResizer<> ImageResizer( 8 );
#endif

	QImage * Result=new QImage(Width,Height,QImage::Format_RGB32);
	ImageResizer.resizeImage( OriginalImage->constBits(), OriginalImage->width(), OriginalImage->height(), 0, Result->bits(), Width, Height, 4, 0);
	return Result;
}


QImage * ResizeImage::CreateSlide(const QImage * OriginalImage, const int32_t MaxSize)
{
	int32_t w=OriginalImage->width();
	int32_t h=OriginalImage->height();
	double ratio;
	if (w>h) ratio=static_cast<double>(w)/static_cast<double>(MaxSize);
	else ratio=static_cast<double>(h)/static_cast<double>(MaxSize);

	w=static_cast<double>(w)/ratio;
	h=static_cast<double>(h)/ratio;
	return Resize(OriginalImage,w,h);
}

QImage * ResizeImage::CreateThumb(const QImage * OriginalImage, const int32_t MaxSize)
{
	const int32_t w=OriginalImage->width();
	const int32_t h=OriginalImage->height();
	QImage SquaredImage;
	int32_t x=0,y=0;
	int32_t SquareSize;
	if (w>h)
	{
		x=(w-h)/2;
		SquareSize=h;
	}
	else
	{
		y=(h-w)/2;
		SquareSize=w;
	}
	SquaredImage=OriginalImage->copy(x,y,SquareSize,SquareSize);
	return Resize(&SquaredImage,MaxSize,MaxSize);
}
