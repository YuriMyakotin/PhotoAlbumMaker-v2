/*!
 * PhotoAlbum v 3.00;
 * https://github.com/YuriMyakotin
 * Copyright (c) 2022-2025 Yuri Myakotin;
 * @license GPLv3
 */

let colors = [];
let CurrentFolderID = 0;
const Folders = new Map();

let ThumbSize = 0;
let ImgLightGallery;
let SiteName = "";
let SiteDescription = "";
let isPrivate = false;
let Version = 0;
let RootFolders = [];
const L = atob("RkEyMzEzQkItQ0UzMTQ5Q0YtQUJDOUUxNEYtMTVCRkU2RkI=");

document.addEventListener("DOMContentLoaded",
	async function () {

		const response = await fetch("Site.json");
		const SiteData = await response.json();

		colors = SiteData.FolderColors;
		document.body.style.backgroundColor = SiteData.BgColor;

		const rules = {};

		for (let i = 0; i < document.styleSheets.length; ++i) {
			const cssRules = document.styleSheets[i].cssRules;
			for (let j = 0; j < cssRules.length; ++j)
				rules[cssRules[j].selectorText] = cssRules[j];

		}

		rules[".folder-name"].style.color = SiteData.FolderNameColor;
		rules[".video-name"].style.color = SiteData.VideoNameColor;
		rules[".cmnt"].style.color = SiteData.ImageDescriptionColor;
		rules[".ImgName"].style.color = SiteData.ImageNameColor;
		rules[".top_navigation"].style.color = SiteData.NavBarCurrentFolderColor;
		rules[".FolderLink"].style.color = SiteData.NavBarLinkColor;
		rules[".bottom-info-bar"].style.color = SiteData.InfoBarColor;
		rules[".folder-desc"].style.color = SiteData.FolderDescriptionColor;
		rules[".ExifInfo"].style.color = SiteData.ExifInfoColor;
		rules[".GpsInfo"].style.color = SiteData.GPSInfoColor;

		if (SiteData.D != null) SiteDescription = SiteData.D;
		if (SiteData.P != null) isPrivate = SiteData.P;
		if (SiteData.V != null) Version = SiteData.V;
		ThumbSize = SiteData.TS;
		SiteName = SiteData.N;

		window.sitestats.innerHTML = SiteData.TIC.toString() + " images, "
			+ SiteData.TVC.toString() + " videos, last updated " + SiteData.LC;

		window.siteversion.innerHTML = (Version/100).toFixed(2).toString();

		const JsonFoldersArray = SiteData.F;

		JsonFoldersArray.forEach((value) => {
			value.SubFolders = [];
			Folders.set(value.I, value);

		});

		Folders.forEach((value) => {
			if (value.PI === 0)
				RootFolders.push(value.I);
			else
				Folders.get(value.PI).SubFolders.push(value.I);
		});



		LoadAlbum(0);

	});


function MakeNavStr() {
	var FolderID = CurrentFolderID;
	if (FolderID === 0) { window.NavStr.innerHTML =SiteName; return; };

	var F = Folders.get(FolderID);

	window.NavStr.innerHTML = F.N;
	while (true) {
		FolderID = F.PI;
		if (FolderID === 0) {
			window.NavStr.innerHTML = `<a class='NoDecorationLink' href="#" onclick="LoadAlbum(0)"><span class='FolderLink'>${SiteName}</span></a>&nbsp;>> ${window.NavStr.innerHTML}`;
			return;
		}
		F = Folders.get(FolderID);
		window.NavStr.innerHTML = `<a class='NoDecorationLink' href="#" onclick="LoadAlbum(${FolderID})"><span class='FolderLink'>${F.N}</span></a>&nbsp;>> ${window.NavStr.innerHTML}`;
	}
}
function LoadAlbum(FolderID) {

	CurrentFolderID = FolderID; MakeNavStr();
	var DescText="";
	if (FolderID === 0) {
		document.title = SiteName;
		DescText = SiteDescription;
	} else {
		const F = Folders.get(FolderID);
		document.title = `${SiteName}: ${F.N}`;
		if (F.C != null) DescText= F.C;
	}

	window.FolderDesc.innerText = DescText;
	if (DescText.length > 0) window.FolderDesc.style.display = "block";
	else window.FolderDesc.style.display = "none";
	LoadSubfolders();

	if (isPrivate) window.addEventListener("contextmenu", e => e.preventDefault());
}




function LoadSubfolders() {

	while (window.VideosLst.lastChild) { window.VideosLst.removeChild(window.VideosLst.lastChild); }
	while (window.ImgLst.lastChild) { window.ImgLst.removeChild(window.ImgLst.lastChild); }
	while (window.FoldersLst.lastChild) { window.FoldersLst.removeChild(window.FoldersLst.lastChild); }


	let SubFolders = (CurrentFolderID === 0) ? RootFolders : Folders.get(CurrentFolderID).SubFolders;

	let cnt = SubFolders.length;
	let i = CurrentFolderID;
	let grid = document.getElementById("FoldersLst");

	if (cnt > 0) {
		window.FoldersLst.style.display = "block";

		SubFolders.forEach((SubFolderID) => {


			const F = Folders.get(SubFolderID);
			const ThumbName = `./${F.TF.toString()}/thumbs/${F.TN}`;
			const AFol = document.createElement('a');
			const bgColor = colors[i % colors.length];
			i++;
			AFol.style.width = (ThumbSize * 2).toString() + "px";
			AFol.style.height = (ThumbSize + 8).toString() + "px";
			AFol.style.backgroundColor = bgColor;
			AFol.className = "Fol";
			AFol.onclick = function() { LoadAlbum(F.I); };
			AFol.id = `f${F.I.toString()}`;
			AFol.title = (F.D != null) ? F.D : "";
			AFol.href = "#";

			const AImg = document.createElement("img");
			AImg.className = "F";
			AImg.src = ThumbName;
			AFol.appendChild(AImg);

			const ASpan = document.createElement("span");
			ASpan.className = "folder-name";
			ASpan.textContent = F.N;
			AFol.appendChild(ASpan);

			grid.appendChild(AFol);
		});
		let msnry = new window.Masonry(grid,
		{
			itemSelector: ".Fol",
			"isFitWidth": true,
			transitionDuration: 0
		});
	}
	else window.FoldersLst.style.display = "none";

	if (CurrentFolderID === 0)
	{
		window.VideosLst.style.display = "none";
		window.ImgLst.style.display = "none";
		return;
	}

	let CurrentFolder = Folders.get(CurrentFolderID);

	cnt = CurrentFolder.V.length;


	grid = document.getElementById("VideosLst");
	if (cnt > 0)
	{
		window.VideosLst.style.display = "block";
		for (let j = 0; j < cnt; j++)
		{
			let V = CurrentFolder.V[j];
			let AVid = document.createElement("a");
			let bgColor = colors[i % colors.length];
			i++;



			AVid.className = "Vid";
			AVid.title = V.D;
			AVid.id = `Vid${V.N}`;

			AVid.href = "#";

			AVid.style.width = (ThumbSize * 2.2).toString() + "px";
			AVid.style.height = (ThumbSize*0.8 + 4).toString() + "px";
			AVid.style.backgroundColor = bgColor;
			AVid.style.wordBreak ="break-word";

			AVid.onclick = function () { ShowVideo(V.N,V.D); };


			let AImg = document.createElement("img");
			AImg.className = "V";
			AImg.src = `./Videos/thumb_${V.N}.jpg`;
			AImg.style.height = (ThumbSize*0.8).toString() + "px";
			AImg.onerror = function() { this.src = "./Content/Video.png"; };

			AVid.appendChild(AImg);

			let ASpan = document.createElement("span");
			ASpan.className = "video-name";
			ASpan.textContent = V.D;


			AVid.appendChild(ASpan);


			grid.appendChild(AVid);

		}



		let msnry = new window.Masonry(grid,
			{
				itemSelector: '.Vid', "isFitWidth": true, transitionDuration: 0
			});


	} else window.VideosLst.style.display = "none";

	grid = document.getElementById("ImgLst");
	cnt = CurrentFolder.Im.length;
	if (cnt > 0) {
		window.ImgLst.style.display = "block";
		for (let j = 0; j < cnt; j++) {
			var IM = CurrentFolder.Im[j];

			let AImg = document.createElement("A");
			AImg.className = "Img";
			AImg.href = CurrentFolderID.toString() + "/slides/" + IM.N;
			AImg.rel = "group";
			AImg.title = IM.N;
			AImg.style.width = ThumbSize.toString() + "px";
			AImg.style.height = ThumbSize.toString() + "px";

			let AThumb = document.createElement("Img");
			AThumb.className = "I";
			AThumb.src = CurrentFolderID.toString() + "/thumbs/" + IM.N;


			let InfoStr = "<div>";
			if (IM.C != null) InfoStr += `<span class='cmnt'>${IM.C}</span><br />`;
			InfoStr +=
				`<a class='NoDecorationLink' id='OrigImg' href='#' title='Original image' onclick="ShowOriginalImage(${
				CurrentFolderID},'${IM.N
				}');return false;"><span class='ImgName'>${IM.N}</span></a><br />`;
			InfoStr +=`<span class='ExifInfo'>${ExifInfoToStr(IM)}</span><br />${GPSInfoToStr(IM)}`;
			InfoStr += "<br /></div>";

			AImg.setAttribute("data-sub-html", InfoStr);

			AImg.appendChild(AThumb);
			grid.appendChild(AImg);


		}


		let msnry = new window.Masonry(grid,
			{
				itemSelector: '.Img',
				"isFitWidth": true,
				transitionDuration: 0
			});


		ImgLightGallery = window.lightGallery(grid,
			{
				licenseKey: L,
				mode: "lg-fade",
				mousewheel: true,
				download: false,
				speed: 0,
				backdropDuration: 0,
				thumbnail: true,
				slideEndAnimation: false,
				startAnimationDuration: 0,
				getCaptionFromTitleOrAlt: false,
				subHtmlSelectorRelative: true,
				startClass: '',
				toogleThumb: false,
				plugins: [lgThumbnail, lgAutoplay, lgRelativeCaption]

			});


	} else window.ImgLst.style.display = "none";

}

function ShowOriginalImage(FolderID, ImageName) {

	var CurrentIdx = ImgLightGallery.index;
	ImgLightGallery.closeGallery();

	const OrigImageLG = window.lightGallery(document.getElementById("OrigImg"),
		{
			licenseKey: L,
			startAnimationDuration: 0,
			backdropDuration: 0,
			counter: false,
			download: !isPrivate,
			speed: 0,
			dynamic: true,
			dynamicEl: [{ src: FolderID.toString() + "/" + ImageName }],
			plugins:[lgZoom]
		});

	OrigImageLG.openGallery(0);
	document.getElementById("OrigImg").addEventListener('lgAfterClose', () => { ImgLightGallery.openGallery(CurrentIdx); });

}




function ShowVideo(VideoName,VideoDescription) {
	const ctrlList=(isPrivate)?"nodownload":"";

	const VideoLG = window.lightGallery(document.getElementById(`Vid${VideoName}`),
		{
			licenseKey: L,
			autoplayVideoOnSlide: true,
			startAnimationDuration: 0,
			backdropDuration: 0,
			counter: false,
			download: false,
			speed: 0,
			dynamic: true,
			dynamicEl: [
				{

					video: {
						source: [
							{
								src: `./videos/${VideoName}`,
								type: "video/mp4"
							}
						],
						attributes: { preload: false, controls: true, controlsList:ctrlList }
					},
					subHtml: `<h2>${VideoDescription}</h2>`
				}
			],
			plugins: [lgVideo]
		});

	VideoLG.openGallery(0);
}


function ConvertDEGToDMS(degstr, lat) {
	const deg = parseFloat(degstr);
	const absolute = Math.abs(deg);

	const degrees = Math.floor(absolute);
	const minutesNotTruncated = (absolute - degrees) * 60;
	const minutes = Math.floor(minutesNotTruncated);
	const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);
	var direction;
	if (lat) {
		direction = deg >= 0 ? "N" : "S";
	} else {
		direction = deg >= 0 ? "E" : "W";
	}

	return degrees + "°" + minutes + "'" + seconds + "\"" + direction;
}

function ExifInfoToStr(IM) {
	var retval = "";
	if (IM.D != null) retval += IM.D + "&nbsp; ";
	if (IM.Cn != null) retval += IM.Cn + "&nbsp; ";
	if (IM.F != null) retval += IM.F + "mm&nbsp; ";
	if (IM.I != null) retval += `ISO:${IM.I}&nbsp; `;
	if (IM.E != null) retval += IM.E + "s&nbsp; ";
	if (IM.A != null) retval += `f/${IM.A}&nbsp; `;
	return retval;

}

function GPSInfoToStr(IM) {

	var retval = "";
	if ((IM.La != null) && (IM.Lo != null))
	{
		const gmapscoords = IM.La + ","+IM.Lo;
		const textcoords = ConvertDEGToDMS(IM.La, true) + ",&nbsp;" + ConvertDEGToDMS(IM.Lo, false);
		retval = `<a class='NoDecorationLink' href="https://www.google.com/maps/dir//${gmapscoords}/@${gmapscoords},18z" target="_blank"><span class='GpsInfo'>${textcoords}</span></a>`;
	}
	return retval;

}