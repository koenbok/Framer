Function::define = (prop, desc) ->
	Object.defineProperty(@prototype, prop, desc)
	Object.__

exports.keys = (a) ->
	for key of a
		key

exports.extend = ->
	args = Array.prototype.slice.call arguments
	a = args[0]
	for obj in args[1..]
		for key, value of obj
			a[key] = value
	return a

exports.update = (a, b) ->
	keys = exports.keys a
	exports.extend a, (exports.filter b, (k) -> k in keys)
	a
		

exports.copy = (a) ->
	exports.extend {}, a

exports.filter = (a, f) ->
	b = {}
	for key, value of a
		if f key, value
			b[key] = value
	return b

exports.union = ->
	Array.prototype.concat.apply Array.prototype, arguments

# exports.extend = (a, b) ->
# 	for key of b 
# 		a[key] = b[key]
# 	return a
# 
# exports.update = (a, b) ->
# 	for key of a 
# 		a[key] = b[key] if b[key]
# 	return a
# 
exports.toggle = ->
	args = Array.prototype.slice.call arguments
	curr = -1
	return ->
		curr++
		curr = 0 if curr >= args.length
		return args[curr]

exports.randomColor = (alpha) ->
	a = alpha or 1.0
	c = -> parseInt(Math.random() * 255)
	"rgba(#{c()}, #{c()}, #{c()}, #{a})"

exports.delay = (time, f) ->
	timer = setTimeout f, time
	window._delayTimers ?= []
	window._delayTimers.push timer
	return timer

exports.remove = (a, e) -> 
	a.splice(t,1)[0] if (t = a.indexOf(e)) > -1
	a



# exports.copy = (a, propertyList) ->
# 	b = {}
# 	if propertyList
# 		for key in propertyList
# 			b[key] = a[key] if a[key] isnt null
# 	else
# 		for key, value of a
# 			b[key] = value if value isnt null
# 	return b

# a =
# 	x: 0
# 	y: 0
# 
# b =
# 	x: 10
# 	
# c =
# 	y: 10
# 
# console.log exports.filter a, (k, v) -> k in ["x"]


# Array::max = ->
# 	for n in @
# 		if !max or n > max then max = n
# 	max

# Array::min = ->
# 	for n in @
# 		if !min or n < min then min = n
# 	min

# Array::sum = ->
# 	if @length > 0
# 		@reduce (x, y) -> x + y
# 	else
# 		0
	
# exports.clone = (obj) ->
# 	if not obj? or typeof obj isnt 'object'
# 		return obj

# 	if obj instanceof Date
# 		return new Date(obj.getTime()) 

# 	if obj instanceof RegExp
# 		flags = ''
# 		flags += 'g' if obj.global?
# 		flags += 'i' if obj.ignoreCase?
# 		flags += 'm' if obj.multiline?
# 		flags += 'y' if obj.sticky?
# 		return new RegExp(obj.source, flags) 

# 	newInstance = new obj.constructor()

# 	for key of obj
# 		newInstance[key] = exports.clone obj[key]

# 	return newInstance