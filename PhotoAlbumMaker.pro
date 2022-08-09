QT       += core gui multimedia widgets multimediawidgets concurrent


CONFIG += c++20

# You can make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
    TinyEXIF.cpp \
    aboutdialog.cpp \
    editfolderdialog.cpp \
    editimagedescriptiondialog.cpp \
    editvideodialog.cpp \
    imagethumbwidget.cpp \
    main.cpp \
    mainwindow.cpp \
    photoalbumtreewidget.cpp \
    resizeimage.cpp \
    setfolderthumbdialog.cpp \
    sitesettingsdialog.cpp \
    videothumbwidget.cpp

HEADERS += \
    PhotoAlbumData.h \
    TinyEXIF.h \
    aboutdialog.h \
    avir.h \
    editfolderdialog.h \
    editimagedescriptiondialog.h \
    editvideodialog.h \
    imagethumbwidget.h \
    mainwindow.h \
    photoalbumtreewidget.h \
    resizeimage.h \
    setfolderthumbdialog.h \
    sitesettingsdialog.h \
    videothumbwidget.h

FORMS += \
    aboutdialog.ui \
    editfolderdialog.ui \
    editimagedescriptiondialog.ui \
    editvideodialog.ui \
    imagethumbwidget.ui \
    mainwindow.ui \
    setfolderthumbdialog.ui \
    sitesettingsdialog.ui \
    videothumbwidget.ui

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target

win32: RC_ICONS = icons/photo-album-icon-clipart-3.ico
mac: ICON =  icons/photo-album-icon-clipart-3.ico

RESOURCES += \
	icons.qrc
