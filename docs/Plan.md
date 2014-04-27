# Layers

- Think about adding a default color. It still throws me off to set a color explicitely with style.backgroundColor. Maybe Framer.Config.defaultColor = f()
- Add something smarter for frames, especially around minX, midX, maxX etc.
- Add a way to copy and deepcopy layer hierarchies.
- Add a way to set text or html content without removing the other layers by accident.
- Maybe ditcht the PSD global for layers and use something more 
- Add a way to get a sublayer by it's (PSD) name. layer.subLayerWithName(LayerName)


# Events

- Throw warnings when you are trying to listen for non existing events, or events that don't make sense.
- Optimize the hell out of the event emitter, as it is going to be used by the animation functions so it will get called a lot.
- Bind the event scope (this) to the object that emitted it: http://goo.gl/r0q3SS

# Animation

- Finish and finalize the api for animators. Do they only get _tick or should we also implement value(time). The latter one is hard to do for RK4 and non deterministic animators. I'm leaning towards just tick.
- Add a delay to the animation class, so it's easy to tweak animations with multiple steps.
- Port the css keyframe animation backend and make it switchable between requestAndimationFrame and css keyframes. Maybe even auto switch it based on what you are trying to do if that isn't too magical.
- Do something smarter with the curve property. It's weird that it's a string while all other objects are plain javascript objects. But it makes sense from a css perspective. Maybe just support both.
- See if we can start animating other properties like colors, shadows, gradients etc. We'll have to explain why these are slower.
- We should do something more smart for toggles or cycles, because that is such an important use case
- Add delay and repeat keywords

# Advanced Behaviour

- Make the draggable a default thing that you can just turn on and off on layers. Maybe like layer.draggable.enabled = true.
- Add a simple state machine like layer.states.define "test", {properties...} and layer.states.transform "new-state"
- Capture more global state about layers and states so we can build a UI around all this.
- Add box2d and let it do some simple things while figuring out an api for a physics engine that can be understood by designers without a math/physics background.



