{_} = require "./Underscore"

Framer = {}

# Root level modules
Framer._ = _
Framer.Utils = (require "./Utils")
Framer.Layer = (require "./Layer").Layer
Framer.Events = (require "./Events").Events
Framer.Animation = (require "./Animation").Animation

_.extend window, Framer if window

# Framer level modules

Framer.Config = (require "./Config").Config
Framer.BaseClass = (require "./BaseClass").BaseClass
Framer.Matrix = (require "./Matrix").Matrix
Framer.LayerStyle = (require "./LayerStyle").LayerStyle
Framer.AnimationLoop = (require "./AnimationLoop").AnimationLoop
Framer.LinearAnimator = (require "./Animators/LinearAnimator").LinearAnimator
Framer.BezierCurveAnimator = (require "./Animators/BezierCurveAnimator").BezierCurveAnimator
Framer.SpringDHOAnimator = (require "./Animators/SpringDHOAnimator").SpringDHOAnimator
Framer.SpringRK4Animator = (require "./Animators/SpringRK4Animator").SpringRK4Animator

window.Framer = Framer if window

# Compatibility for Framer 2
require "./Compat"