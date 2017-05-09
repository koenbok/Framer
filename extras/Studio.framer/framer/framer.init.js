(function() {

function isFileLoadingAllowed() {
	return (window.location.protocol.indexOf("file") == -1)
}

function isHomeScreened() {
	return ("standalone" in window.navigator) && window.navigator.standalone == true
}

function isCompatibleBrowser() {
	return Utils.isWebKit()
}

var alertNode;

function dismissAlert() {
	alertNode.parentElement.removeChild(alertNode)
	loadProject()
}

function showAlert(html) {

	alertNode = document.createElement("div")

	alertNode.classList.add("framerAlertBackground")
	alertNode.innerHTML = html

	document.addEventListener("DOMContentLoaded", function(event) {
		document.body.appendChild(alertNode)
	})

	window.dismissAlert = dismissAlert;
}

function showBrowserAlert() {
	var html = ""
	html += "<div class='framerAlert'>"
	html += "<strong>Error: Not A WebKit Browser</strong>"
	html += "Your browser is not supported. <br> Please use Safari or Chrome.<br>"
	html += "<a class='btn' href='javascript:void(0)' onclick='dismissAlert();'>Try anyway</a>"
	html += "</div>"

	showAlert(html)
}

function showFileLoadingAlert() {
	var html = ""
	html += "<div class='framerAlert'>"
	html += "<strong>Error: Local File Restrictions</strong>"
	html += "Preview this prototype with Framer Mirror or learn more about "
	html += "<a href='https://github.com/koenbok/Framer/wiki/LocalLoading'>file restrictions</a>.<br>"
	html += "<a class='btn' href='javascript:void(0)' onclick='dismissAlert();'>Try anyway</a>"
	html += "</div>"

	showAlert(html)
}

function showHomeScreenAlert() {

	link = document.createElement("link");
	link.href = "framer/mirror.css"
	link.type = "text/css"
	link.rel = "stylesheet"
	link.media = "screen"

	document.addEventListener("DOMContentLoaded", function(event) {
		document.getElementsByTagName("head")[0].appendChild(link)
	})

	var html = ""
	html += "<figure class='icon-close' href='javascript:void(0)' onclick='dismissAlert();'></figure>"
	html += "<section class='wrapper'>"
	html += "<figure class='icon-framer'></figure><h1>Install Prototype</h1>"
	html += "<p>Tap <div class='share'><figure class='icon-share'></figure> Share</div>, then choose 'Add to Home Screen'</p> "
	html += "<section class='arrow'><figure class='icon-arrow'></figure></section>"
	html += "</section>"

	showAlert(html)
}

function loadProject(callback) {
	CoffeeScript.load("app.coffee", callback)
}

function setDefaultPageTitle() {
	// If no title was set we set it to the project folder name so
	// you get a nice name on iOS if you bookmark to desktop.
	document.addEventListener("DOMContentLoaded", function() {
		if (document.title == "") {
			if (window.FramerStudioInfo && window.FramerStudioInfo.documentTitle) {
				document.title = window.FramerStudioInfo.documentTitle
			} else {
				document.title = window.location.pathname.replace(/\//g, "")
			}
		}
	})
}

function init() {
	if (Utils.isFramerStudio()) {
		return
	}

	setDefaultPageTitle()

	if (!isCompatibleBrowser()) {
		return showBrowserAlert()
	}

	if (!isFileLoadingAllowed()) {
		return showFileLoadingAlert()
	}

	// if (Utils.isMobile() && !isHomeScreened()) {
	// 	return showHomeScreenAlert()
	// }

	loadProject(function(){
		Framer.CurrentContext.layout()
	})


}

init()
})()
