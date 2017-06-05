{_} = require "./Underscore"

Framer = {}

# Root level modules
Framer._ = _
Framer.Utils = (require "./Utils")
Framer.Color = (require "./Color").Color
Framer.Layer = (require "./Layer").Layer
Framer._Layer = Framer.Layer # So it won't be overridden by MobileScrollFix
Framer.BackgroundLayer = (require "./BackgroundLayer").BackgroundLayer
Framer.VideoLayer = (require "./VideoLayer").VideoLayer
Framer.SVGLayer = (require "./SVGLayer").SVGLayer
Framer.TextLayer = (require "./TextLayer").TextLayer
Framer.Events = (require "./Events").Events
Framer.Gestures = (require "./Gestures").Gestures
Framer.Animation = (require "./Animation").Animation
Framer.AnimationGroup = (require "./AnimationGroup").AnimationGroup
Framer.AnimationStateGroup = (require "./AnimationGroup").AnimationStateGroup
Framer.Screen = (require "./Screen").Screen
Framer.Align = (require "./Align").Align
Framer.print = (require "./Print").print
Framer.Router = (require "./Router").Router
Framer.Route = (require "./Route").Route
Framer.Link = (require "./Link").Link

# Components
Framer.ScrollComponent = (require "./Components/ScrollComponent").ScrollComponent
Framer.PageComponent = (require "./Components/PageComponent").PageComponent
Framer.SliderComponent = (require "./Components/SliderComponent").SliderComponent
Framer.RangeSliderComponent = (require "./Components/RangeSliderComponent").RangeSliderComponent
Framer.DeviceComponent = (require "./Components/DeviceComponent").DeviceComponent
Framer.GridComponent = (require "./Components/GridComponent").GridComponent
Framer.FlowComponent = (require "./Components/FlowComponent").FlowComponent
Framer.CircularProgressComponent = (require "./Components/CircularProgressComponent").CircularProgressComponent
Framer.MIDIComponent = (require "./Components/MIDIComponent").MIDIComponent
Framer.DeviceView = Framer.DeviceComponent # Compat

_.extend(window, Framer) if window

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

Framer.Curves = require "./Animators/Curves"
window.Bezier = Framer.Curves.Bezier
window.Spring = Framer.Curves.Spring

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
Framer.DefaultContext = new Framer.Context(name: "Default")
Framer.DefaultContext.backgroundColor = "white"
Framer.CurrentContext = Framer.DefaultContext

window.Canvas = new (require "./Canvas").Canvas

Framer.Extras.MobileScrollFix.enable() if Utils.isMobile()
Framer.Extras.TouchEmulator.enable() if not Utils.isTouch()
Framer.Extras.ErrorDisplay.enable() if not Utils.isFramerStudio()
Framer.Extras.Preloader.enable() if not Utils.isFramerStudio()
Framer.Extras.Hints.enable() if not Utils.isFramerStudio()

Utils.domComplete(Framer.Loop.start)
