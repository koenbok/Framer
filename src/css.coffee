exports.addStyle = (css) ->
	
	styleSheet = document.createElement "style"
	styleSheet.innerHTML = css
	
	document.head.appendChild styleSheet


exports.addStyle "
.framer {
	display: block;
	visibility: visible;
	position: absolute;
	top:auto; right:auto; bottom:auto; left:auto;
	width:auto; height:auto;
	overflow: visible;
	z-index:0;
	opacity:1;
	box-sizing: border-box;
	-webkit-box-sizing: border-box;
	-webkit-transform-origin: 50% 50% 0%;
	-webkit-backface-visibility: hidden;
	-webkit-transform-style: flat;
}"