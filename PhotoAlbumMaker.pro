QT       += core gui multimedia widgets multimediawidgets concurrent


#CONFIG += c++latest

CONFIG += c++20

win32
{
QMAKE_CXXFLAGS += /Zc:__cplusplus /O2 /Ot /Oi /GL /arch:AVX2
}


# You can make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
    TinyEXIF.cpp \
    aboutdialog.cpp \
    clickablelabel.cpp \
    editcolorsdialog.cpp \
    editfolderdialog.cpp \
    editimagedescriptiondialog.cpp \
    editvideodialog.cpp \
    foldercolorswidget.cpp \
    imagethumbwidget.cpp \
    main.cpp \
    mainwindow.cpp \
    photoalbumtreewidget.cpp \
    resizeimage.cpp \
    setfolderthumbdialog.cpp \
    sitecolors.cpp \
    sitesettingsdialog.cpp \
    videothumbwidget.cpp

HEADERS += \
    PhotoAlbumData.h \
    TinyEXIF.h \
    aboutdialog.h \
    avir.h \
    avir_dil.h \
    avir_float8_avx.h \
    clickablelabel.h \
    editcolorsdialog.h \
    editfolderdialog.h \
    editimagedescriptiondialog.h \
    editvideodialog.h \
    foldercolorswidget.h \
    imagethumbwidget.h \
    mainwindow.h \
    photoalbumtreewidget.h \
    resizeimage.h \
    setfolderthumbdialog.h \
    sitecolors.h \
    sitesettingsdialog.h \
    videothumbwidget.h

FORMS += \
    aboutdialog.ui \
    editcolorsdialog.ui \
    editfolderdialog.ui \
    editimagedescriptiondialog.ui \
    editvideodialog.ui \
    foldercolorswidget.ui \
    imagethumbwidget.ui \
    mainwindow.ui \
    setfolderthumbdialog.ui \
    sitesettingsdialog.ui \
    videothumbwidget.ui

# Default rules for deployment.
#qnx: target.path = /tmp/$${TARGET}/bin
#else: unix:!android: target.path = /opt/$${TARGET}/bin
#!isEmpty(target.path): INSTALLS += target

win32: RC_ICONS = icons/photo-album-icon-clipart-3.ico
mac: ICON =  icons/photo-album-icon-clipart-3.ico

RESOURCES += \
	icons.qrc \
	website.qrc

DISTFILES += \
	WebsiteContent/index.html \
	WebsiteContent/Video.png \
	WebsiteContent/index.html \
	WebsiteContent/lg.svg \
	WebsiteContent/lg.ttf \
	WebsiteContent/lg.woff \
	WebsiteContent/lg.woff2 \
	WebsiteContent/loading.gif \
	WebsiteContent/photoalbum-bundle.min.js \
	WebsiteContent/photogallery-bundle.min.css
