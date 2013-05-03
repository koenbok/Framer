utils = require "../utils"

{View} = require "../views/view"
{Events} = require "../primitives/events"


# Add specific events for scrollview
Events.ScrollStart = "scrollstart"
Events.Scroll = "scroll"
Events.ScrollEnd = "scrollend"


class ScrollView extends View
	
	constructor: ->
		super
		
		@clip = true
		
		@contentView = new View superView:@
		@contentView.on "change:subViews", @_changeSubViews
		
		@_dragger = new ui.Draggable @contentView
		@_dragger.on Events.DragStart, @_scrollStart
		@_dragger.on Events.DragMove, @_scroll
		@_dragger.on Events.DragEnd, @_scrollEnd
		
		@endBehaviour = @_endBehaviourMomentum
	
	centerView: (view, animate=false) ->
		@scrollFrame = @_scrollFrameForView view
	
	snapToView: (view, curve="spring(1000,20,1000)") ->
		@contentView.animate
			properties: utils.pointInvert @_scrollFrameForView view
			curve: curve
	
	closestView: (frame=@scrollFrame)->
		_.first _.sortBy @contentView.subViews, (view) =>
			utils.pointTotal utils.pointDistance(view.frame, frame)
	
	calculateVelocity: -> @_dragger.calculateVelocity()

	@define "scrollX",
		get: -> @_dragger.speed.x is 1
		set: (value) -> @_dragger.speed.x = if value is true then 1 else 0

	@define "scrollY",
		get: -> @_dragger.speed.y is 1
		set: (value) -> @_dragger.speed.y = if value is true then 1 else 0

	@define "scrollFrame",
		get: ->
			return new Framer.Frame utils.pointInvert @contentView
		set: (frame) ->
			@contentView.frame = utils.pointInvert \
				utils.framePoint @contentView.frame

	@define "paging",
		get: -> 
			@_paging
		set: (value) ->
			@_paging = value
			
			if value is true
				@endBehaviour = @_endBehaviourSnap
			else
				@endBehaviour = @_endBehaviourMomentum

	_scrollFrameForView: (view) ->
		frame = 
			x: view.x + (view.width - @width) / 2.0
			y: view.y + (view.height - @height) / 2.0

	_changeSubViews: (event) =>
		
		# If views change we need to re-calculate the contentView size
		event?.added?.map (view) => view.on "change:frame", @_updateSize
		event?.removed?.map (view) => view.off "change:frame", @_updateSize
		
		@_updateSize()

	_updateSize: =>
		@contentView.frame = utils.frameSize @contentView.contentFrame()

	_scrollStart: (event) =>
		event.preventDefault()
		@emit Events.ScrollStart, event

	_scroll: (event) =>
		event.preventDefault()
		@emit Events.Scroll, event

	_scrollEnd: (event) =>
		event.preventDefault()
		@endBehaviour? event
		@emit Events.ScrollEnd, event
		
	_endBehaviourMomentum: (event) =>
		
		touchEvent = Events.touchEvent event
	
		constant1 = 1000
		constant2 = 0
	
		velocity = @calculateVelocity()
		totalVelocity = utils.pointAbs utils.pointTotal velocity
		
		animation = @contentView.animate
			properties:
				x: parseInt(@contentView.x + (velocity.x * constant1))
				y: parseInt(@contentView.y + (velocity.y * constant1))
			curve: "spring(100,80,#{totalVelocity * constant2})"
	
	_endBehaviourSnap: (event) =>
		
		touchEvent = Events.touchEvent event
	
		constant1 = 1
		constant2 = 1
	
		friction = 32
	
		velocity = @calculateVelocity()
		totalVelocity = utils.pointAbs utils.pointTotal velocity
	
		curve = "spring(300,#{friction * constant1},#{totalVelocity * constant2})"

		animation = @snapToView @closestView(), curve

exports.ScrollView = ScrollView
