function showAlert() {

	var alertNode = document.createElement("div");
	alertNode.classList.add("framerAlert");
	alertNode.innerHTML  = "Error: Chrome has security restrictions loading local files. Safari works fine.<br> You can get Chrome to work by running this on a small webserver. <a href='https://github.com/koenbok/Framer/wiki/LocalLoading'>Read more here</a>.";

	document.addEventListener("DOMContentLoaded", function(event) {
		document.body.appendChild(alertNode);
	});
};

function loadApp() {

	var scriptNode = document.createElement("script");
	scriptNode.setAttribute("src", "app.coffee");
	scriptNode.setAttribute("type", "text/coffeescript");

	document.head.appendChild(scriptNode);
};

function init() {

	// Only run this outside of Framer Studio
	if (navigator.userAgent.indexOf("FramerStudio") != -1)
		return

	// See if this is Chrome and local, and throw a warning if that is the case
	// Otherwise, just insert the app.coffee script so the transpiler picks it up
	if (window.chrome && location.protocol == "file:")
		showAlert();
	else
		loadApp();
};

init();

