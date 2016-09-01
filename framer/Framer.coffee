{_} = require "./Underscore"

Framer = {}

# Root level modules
Framer._ = _
Framer.Utils = (require "./Utils")
Framer.Color = (require "./Color").Color
Framer.Layer = (require "./Layer").Layer
Framer.BackgroundLayer = (require "./BackgroundLayer").BackgroundLayer
Framer.VideoLayer = (require "./VideoLayer").VideoLayer
Framer.SVGLayer = (require "./SVGLayer").SVGLayer
Framer.Events = (require "./Events").Events
Framer.Gestures = (require "./Gestures").Gestures
Framer.Animation = (require "./Animation").Animation
Framer.AnimationGroup = (require "./AnimationGroup").AnimationGroup
Framer.Screen = (require "./Screen").Screen
Framer.Align = (require "./Align").Align
Framer.print = (require "./Print").print

# Components
Framer.ScrollComponent = (require "./Components/ScrollComponent").ScrollComponent
Framer.PageComponent = (require "./Components/PageComponent").PageComponent
Framer.SliderComponent = (require "./Components/SliderComponent").SliderComponent
Framer.DeviceComponent = (require "./Components/DeviceComponent").DeviceComponent
Framer.GridComponent = (require "./Components/GridComponent").GridComponent
Framer.NavComponent = (require "./Components/NavComponent").NavComponent
Framer.CircularProgressComponent = (require "./Components/CircularProgressComponent").CircularProgressComponent
Framer.MIDIComponent = (require "./Components/MIDIComponent").MIDIComponent
Framer.DeviceView = Framer.DeviceComponent # Compat

for name, module of Framer
    Object.defineProperty window, name,
        enumerable: false
        configurable: false
        writable: false
        value: module

# _.extend(window, Framer) if window

# Framer level modules
Framer.Context = (require "./Context").Context
Framer.Config = (require "./Config").Config
Framer.EventEmitter = (require "./EventEmitter").EventEmitter
Framer.BaseClass = (require "./BaseClass").BaseClass
Framer.LayerStyle = (require "./LayerStyle").LayerStyle
Framer.AnimationLoop = (require "./AnimationLoop").AnimationLoop
Framer.LinearAnimator = (require "./Animators/LinearAnimator").LinearAnimator
Framer.BezierCurveAnimator = (require "./Animators/BezierCurveAnimator").BezierCurveAnimator
Framer.SpringDHOAnimator = (require "./Animators/SpringDHOAnimator").SpringDHOAnimator
Framer.SpringRK4Animator = (require "./Animators/SpringRK4Animator").SpringRK4Animator
Framer.LayerDraggable = (require "./LayerDraggable").LayerDraggable

Framer.Importer = (require "./Importer").Importer
Framer.Extras = require "./Extras/Extras"

Framer.GestureInputRecognizer = new (require "./GestureInputRecognizer").GestureInputRecognizer
Framer.Version = require "../build/Version"
Framer.Loop = new Framer.AnimationLoop()

# Metadata
Framer.Info = {}

window.Framer = Framer if window

# Set the defaults
Defaults = (require "./Defaults").Defaults
Defaults.setup()
Framer.resetDefaults = Defaults.reset

# Create the default context, set it to invisble by default so
# the preloader can pick it up if it needs to.
Framer.DefaultContext = new Framer.Context(name:"Default")
Framer.DefaultContext.backgroundColor = "white"
Framer.DefaultContext.visible = false
Framer.CurrentContext = Framer.DefaultContext

window.Canvas = new (require "./Canvas").Canvas

Framer.Extras.MobileScrollFix.enable() if Utils.isMobile()
Framer.Extras.TouchEmulator.enable() if not Utils.isTouch()
Framer.Extras.ErrorDisplay.enable() if not Utils.isFramerStudio()
Framer.Extras.Preloader.enable() if not Utils.isFramerStudio()
Framer.Extras.Hints.enable() if not Utils.isFramerStudio()

# If there is no preloader around, we show the default context
# This _won't_ avoid a flickr of the device if you use the preloader
# from your code directly, unfortunately. But at this point, that is an
# action in the future, so we can't know wether that will happen or not.
Framer.DefaultContext.visible = true unless Framer.Preloader

Utils.domComplete(Framer.Loop.start)