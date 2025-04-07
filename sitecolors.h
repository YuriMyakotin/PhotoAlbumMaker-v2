#ifndef SITECOLORS_H
#define SITECOLORS_H
#include <QColor>
#include <vector>

class SiteColors
{
public:
    static QColor BgColor;
    static QColor BottomInfoBarColor;
    static std::vector<QColor> FolderColors;
    static QColor NavBarLinkColor;
    static QColor NavBarCurrentFolderNameColor;
    static QColor FolderNameColor;
    static QColor VideoNameColor;
    static QColor FolderDescriptionColor;
    static QColor ImageNameColor;
    static QColor ExifInfoColor;
    static QColor GPSInfoColor;
    static QColor ImageDescriptionColor;

    static void ResetColorsToDefault();
};

#endif // SITECOLORS_H
