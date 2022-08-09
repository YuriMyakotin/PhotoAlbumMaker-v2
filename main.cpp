#include "mainwindow.h"

#include <QApplication>

int main(int argc, char *argv[])
{
	QApplication a(argc, argv);
	QCoreApplication::setApplicationName("PhotoAlbumMaker");
	QCoreApplication::setOrganizationName("Yury Myakotin");
	MainWindow w;
	w.show();
	w.Start();
	return QApplication::exec();
}
