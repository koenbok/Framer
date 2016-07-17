## NavComponent

The goal of the NavComponent is to quickly design screen flows with animated transitions.


```
cardA = new Layer
	size: Screen.size
	backgroundColor: "red"

cardB = new Layer
	size: Screen.size
	backgroundColor: "blue"

nav = new NavComponent()
nav.push(cardA)

cardA.onTap -> nav.push(cardB, true, true)
cardB.onTap -> nav.back()
```

#### History

A NavComponent keeps a history of the layers it has shown. It uses it itself where to go when `.back()` is called. You can inspect the history using the `.stack` property or see the current or previous shown layer with `.current` and `.previous`.

The history works like a stack. So every time `.back()` is called, the last pushed layer gets removed.

#### Custom Transitions

Apart from the default transitions (which are modeled after iOS) you can customize or build your own ones. The transitions use states internally to go back and forward. There are three layers (the current and next one, and a background) and two states (back and forward) so you can define six states in total. If you don't define a specific state, the NavComponent assumes you don't want to animate that layer.

```
scaleTransition = (nav, layerA, layerB, background) ->
	transition =
		layerA:
			show: {x: 0, y: 0, scale: 1.0, opacity:1}
			hide: {x: 0, y: 0, scale: 0.5, opacity:0}
			options: {curve: "spring(300, 35, 0)"}
		layerB:
			show: {x: 0, y: 0, scale: 1.0, opacity:1}
			hide: {x: 0, y: 0, scale: 0.5, opacity:0}
			options: {curve: "spring(300, 35, 0)"}


cardA = new Layer
	size: Screen.size
	backgroundColor: "red"

cardB = new Layer
	size: Screen.size
	backgroundColor: "blue"

nav = new NavComponent()
nav.push(cardA)

cardA.onTap -> nav.push(cardB, true, true, scaleTransition)
cardB.onTap -> nav.back()

```

#### Thanks

### API

###### .constructor()

The constructor takes all default layer options, and defaults to fullscreen size.

###### .push(layer, animate=true, wrap=true, transitionFunction)**

This pushes the layer into the view, optionally using a default push animation or a custom defined one.

- **layer**: the layer to show.
- **animate**: animate or set instantly.
- **wrap**: automatically wrap the layer in a ScrollComponent if the size exceeds the NavComponent size. Also disables horizontal/vertical scrolling based on the size.
- **transitionFunction**: use a custom transition function.


###### .dialog(layer : Layer, animate=true : Bool)

###### .modalLeft(layer : Layer, animate=true : Bool)

###### .modalTop(layer : Layer, animate=true : Bool)

###### .modalRight(layer : Layer, animate=true : Bool)

###### .modalBottom(layer : Layer, animate=true : Bool)

###### .back()

### TODO

- Check transition events
- Wrapping of NavComponent
- Hooks for startForward, endForward etc.