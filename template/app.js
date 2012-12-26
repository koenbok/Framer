view = new View({
	x:100, y:100,
	width:200, height:200
});

view.style = {
	textAlign: "center",
	lineHeight: view.height + "px",
	backgroundColor: "rgba(255,0,0,0.5)"
};

view.html = "Hello";

view.on("click", function() {
	view.scale = 0.8;
	view.animate({
		properties: {scale:1},
		curve: "spring(100,15,1000)"
	});
});