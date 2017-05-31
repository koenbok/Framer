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

	loadProject(function(){
		// CoffeeScript: Framer?.CurrentContext?.emit?("loaded:project")
		var context;
		if (typeof Framer !== "undefined" && Framer !== null) {
			if ((context = Framer.CurrentContext) != null) {
				if (typeof context.emit === "function") {
					context.emit("loaded:project");
				}
			}
		}
	})
}

init()

})()
