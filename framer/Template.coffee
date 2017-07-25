"""

Valid inputs:

template("{speed}kmh", {speed: 100})
template("{ speed }kmh", {speed: 100})
template("{{ speed }}kmh", {speed: 100})

template("{speed}kmh", 100)

"""


template = (text, context) ->

	ctx = _.clone(context)

	# https://regex101.com/r/x9mazj/1
	result = text.replace /{+[ ]{0,}[^\s]+[ ]{0,}}+/g, (key) ->
		return context if not _.isObject(context)
		return _.values(context)[0] if context.length = 1
		key = key.replace(/[{}\s]+/g, "")
		return context[key] or "???"

	result = new String(result)

	# Save the input so we can rebuild this later
	result.template =
		text: text
		context: ctx
	
	return result

exports.template = template