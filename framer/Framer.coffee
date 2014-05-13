{_} = require "./Underscore"

Framer = {}

# Root level modules
Framer._ = _
Framer.Utils = (require "./Utils")
Framer.Frame = (require "./Frame").Frame
Framer.Layer = (require "./Layer").Layer
Framer.Events = (require "./Events").Events
Framer.Animation = (require "./Animation").Animation

_.extend window, Framer if window

# Framer level modules

Framer.Config = (require "./Config").Config
Framer.BaseClass = (require "./BaseClass").BaseClass
Framer.LayerStyle = (require "./LayerStyle").LayerStyle
Framer.AnimationLoop = (require "./AnimationLoop").AnimationLoop
Framer.LinearAnimator = (require "./Animators/LinearAnimator").LinearAnimator
Framer.BezierCurveAnimator = (require "./Animators/BezierCurveAnimator").BezierCurveAnimator
Framer.SpringDHOAnimator = (require "./Animators/SpringDHOAnimator").SpringDHOAnimator
Framer.SpringRK4Animator = (require "./Animators/SpringRK4Animator").SpringRK4Animator
Framer.Importer = (require "./Importer").Importer
Framer.Debug = (require "./Debug").Debug

window.Framer = Framer if window

# Compatibility for Framer 2
require "./Compat"

# Set the defaults
Defaults = (require "./Defaults").Defaults
Framer.resetDefaults = Defaults.reset
Framer.resetDefaults()