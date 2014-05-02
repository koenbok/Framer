
layer = new Layer image:"https://fbexternal-a.akamaihd.net/safe_image.php?d=AQCzxOIN078nUkhK&w=470&h=246&url=http%3A%2F%2Fwww.newyorker.com%2Fonline%2Fblogs%2Fcomment%2F186296970-FB.jpg&cfs=1&upscale&sx=0&sy=1&sw=1200&sh=628"

layer.states.add
	test: {x:100, scale:1.5}
	poop: {y:100, rotationY:300}

layer.on "click", ->
	layer.states.next()