{_} = require "./Underscore"

Framer = {}

# Root level modules
Framer._ = _
Framer.Utils = (require "./Utils")
Framer.Frame = (require "./Frame").Frame
Framer.Layer = (require "./Layer").Layer
Framer.BackgroundLayer = (require "./BackgroundLayer").BackgroundLayer
Framer.VideoLayer = (require "./VideoLayer").VideoLayer
Framer.Events = (require "./Events").Events
Framer.Animation = (require "./Animation").Animation
Framer.Screen = (require "./Screen").Screen
Framer.print = (require "./Print").print

_.extend window, Framer if window

# Framer level modules
Framer.Config = (require "./Config").Config
Framer.EventEmitter = (require "./EventEmitter").EventEmitter
Framer.BaseClass = (require "./BaseClass").BaseClass
Framer.LayerStyle = (require "./LayerStyle").LayerStyle
Framer.AnimationLoop = (require "./AnimationLoop").AnimationLoop
Framer.LinearAnimator = (require "./Animators/LinearAnimator").LinearAnimator
Framer.BezierCurveAnimator = (require "./Animators/BezierCurveAnimator").BezierCurveAnimator
Framer.SpringDHOAnimator = (require "./Animators/SpringDHOAnimator").SpringDHOAnimator
Framer.SpringRK4Animator = (require "./Animators/SpringRK4Animator").SpringRK4Animator
Framer.Importer = (require "./Importer").Importer
Framer.Debug = (require "./Debug").Debug
Framer.Session = (require "./Session").Session
Framer.Extras = require "./Extras/Extras"

window.Framer = Framer if window

# Compatibility for Framer 2
require "./Compat"

# Fix for mobile scrolling
Framer.Extras.MobileScrollFix.enable() if Utils.isMobile()

# Set the defaults
Defaults = (require "./Defaults").Defaults
Framer.resetDefaults = Defaults.reset
Framer.resetDefaults()