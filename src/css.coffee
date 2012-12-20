addStyle = (css) ->
	
	head = document.getElementsByTagName "head"
	head = head[0] if head
	
	if not head
		head = document.body or document.documentElement

	baseStyle = document.createElement "style"
	baseStyle.id = "UILayer-base-style"
	baseStyle.appendChild document.createTextNode(css)
    
	head.appendChild baseStyle

addStyle "
.uilayer {
	display: block;
	visibility: visible;
	position: absolute;
	top:auto; right:auto; bottom:auto; left:auto;
	width:auto; height:auto;
	overflow: visible;
	z-index:0;
	opacity:1;
	-webkit-box-sizing: border-box;
}
.uilayer.textureBacked {
	-webkit-transform: matrix3d(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1);
	-webkit-transform-origin: 50% 50% 0%;
	-webkit-backface-visibility: hidden;
	-webkit-transform-style: flat;
}
.uilayer.animated {
	-webkit-transition-duration: 500ms;
	-webkit-transition-timing-function: linear;
	-webkit-transition-delay: 0;
	-webkit-transition-property: none;
}"