import * as _ from "lodash"

export const isWebKit = () => ((window as any)["WebKitCSSMatrix"] !== undefined) && !isEdge();

export const webkitVersion = function() {
	let version = -1;
	let regexp = /AppleWebKit\/([\d.]+)/;
	let result = regexp.exec(navigator.userAgent);
	if (result) { version = parseFloat(result[1]); }
	return version;
};

export const isChrome = () => /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

export const isSafari = () => /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

export const isEdge = () => /Edge/.test(navigator.userAgent);

export const isAndroid = () => /(android)/i.test(navigator.userAgent);

export const isIOS = () => /(iPhone|iPod|iPad)/i.test(navigator.platform);

export const isMacOS = () => /Mac/.test(navigator.platform);

export const isWindows = () => /Win/.test(navigator.platform);

export const isTouch = () =>
	(window.ontouchstart === null) &&
	(window.ontouchmove === null) &&
	(window.ontouchend === null)
;

export const isDesktop = () => deviceType() === "desktop";

export const isPhone = () => deviceType() === "phone";

export const isTablet = () => deviceType() === "tablet";

export const isMobile = () => isPhone() || isTablet();

export const isFileUrl = (url: string) => _.startsWith(url, "file://");

export const isDataUrl = (url: string) => _.startsWith(url, "data:");

export const isRelativeUrl = (url: string) => !/^([a-zA-Z]{1,8}:\/\/).*$/.test(url);

export const isLocalServerUrl = (url: string) => (url.indexOf("127.0.0.1") !== -1) || (url.indexOf("localhost")  !== -1);

export const isLocalUrl = (url: string) => {
	if (isFileUrl(url)) { return true; }
	if (isLocalServerUrl(url)) { return true; }
	return false;
};

export const isLocalAssetUrl = (url: string, baseUrl: string) => {
	if (baseUrl == null) { baseUrl = window.location.href; }
	if (isDataUrl(url)) { return false; }
	if (isLocalUrl(url)) { return true; }
	if (isRelativeUrl(url) && isLocalUrl(baseUrl)) { return true; }
	return false;
};

export const isFramerStudio = () => navigator.userAgent.indexOf("FramerStudio") !== -1;

export const framerStudioVersion = function() {

	if (isFramerStudio()) {

		let version;
		let isBeta = navigator.userAgent.indexOf("FramerStudio/beta") >= 0;
		let isLocal = navigator.userAgent.indexOf("FramerStudio/local") >= 0;
		let isFuture = navigator.userAgent.indexOf("FramerStudio/future") >= 0;
		if (isBeta || isLocal || isFuture) { return Number.MAX_VALUE; }

		let matches = navigator.userAgent.match(/\d+$/);
		if (matches && (matches.length > 0)) { version = parseInt(matches[0]); }
		if (_.isNumber(version)) { return version; }
	}

	// if we don't know the version we are probably running the beta or a local build
	return Number.MAX_VALUE;
};

export const devicePixelRatio = () => window.devicePixelRatio;

export const isJP2Supported = () => isWebKit() && !isChrome();

export const isWebPSupported = () => isChrome();

export const deviceType = function() {

	// Taken from
	// https://github.com/jeffmcmahan/device-detective/blob/master/bin/device-detect.js

	if (/(tablet)|(iPad)|(Nexus 9)/i.test(navigator.userAgent)) {
		return "tablet";
	}

	if (/(mobi)/i.test(navigator.userAgent)) {
		return "phone";
	}

	return "desktop";
};

export const deviceFont = (os: string) => {

	// https://github.com/jonathantneal/system-font-css

	if (!os) {
		if (isMacOS()) { os = "macos"; }
		if (isIOS()) { os = "ios"; }
		if (isAndroid()) { os = "android"; }
		if (isWindows()) { os = "windows"; }
	}

	if (os === "macos") { return "-apple-system, SF UI Text, Helvetica Neue"; }
	if (os === "ios") { return "-apple-system, SF UI Text, Helvetica Neue"; }
	if (os === "android") { return "Roboto, Helvetica Neue"; }
	if (os === "windows") { return "Segoe UI"; }
	return "Helvetica";
}