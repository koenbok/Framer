{Layer, layerProperty, updateShadow} = require "./Layer"

class exports.VekterTextLayer extends Layer
	@define "styledText", layerProperty(@, "styledText", null, null, _.isObject, null, {}, (layer, value) ->
		layer.renderText()
	)

	renderText: ->
		@html = ""
		if not @_textElement?
			@_textElement = document.createElement "div"
			@_element.appendChild @_textElement
			@_textElement.style.cssText = "font: normal normal normal 16px/normal -apple-system, BlinkMacSystemFont;"
			@_textElement.style.outline = "none"
			@_textElement.style.whiteSpace = "pre-wrap"
			@_textElement.style.wordWrap = "break-word"
			@_textElement.style.zoom = @context.scale
		for block in @_textBlocks ? []
			@_textElement.removeChild(block)
		@_textBlocks = []
		for block in @styledText.blocks
			blockElement = document.createElement "div"
			blockElement.style.fontSize = "1px"
			blockElement.style.textAlign = @styledText.alignment
			@_textBlocks.push blockElement
			@_textElement.appendChild blockElement
			text = block.text
			for style in block.inlineStyles
				spanElement = document.createElement "span"
				spanElement.textContent = text.substring(style.startIndex, style.endIndex)
				for prop, value of style.css
					spanElement.style[prop] = value
				blockElement.appendChild spanElement

