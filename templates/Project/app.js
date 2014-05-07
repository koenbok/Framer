// Welcome to Framer

// This is just demo code. Feel free to delete it all.


// Create the logo view
logoView = new ImageView({
	width:251, height:302,
	image: "images/framer-logo.png"
});

// Place it center screen
logoView.midX = window.innerWidth / 2
logoView.midY = window.innerHeight / 2 - 100

originalX = logoView.x

// Bounce on a click
logoView.on("click", function() {
	logoView.x = 500,
	logoView.animate({
		properties: {x:originalX},
		curve: "spring",
		curveOptions: {
			tension: 1000,
			friction: 10,
		}
	});
});

// Create the logo view
instructionsView = new View({
	x: logoView.x, y: logoView.maxY + 30,
	width:logoView.width, height:100,
});

// Add some handy links
instructionsView.backgroundColor = null
instructionsView.html = "To start editing, open the app.js file in your text editor.<br><br>";
instructionsView.html += "<a href='http://www.framerjs.com/documentation?origin=project' target='new'>Documentation</a> &nbsp;";
instructionsView.html += "<a href='http://www.framerjs.com/examples?origin=project' target='new'>Examples</a>";
instructionsView.style = {
	font: "15px/1.4em Helvetica",
	textAlign: "center"
}
