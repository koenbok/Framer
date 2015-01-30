
style = 
	font: "20px/1em Menlo"

layer = new Layer
layer.backgroundColor = "rgba(255,0,0,.4)"
layer.style = style
layer.html = "Hello Koen Bok"

layer.frame = Utils.textSize(layer.html, style, {width:100})
print layer.frame