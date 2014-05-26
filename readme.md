## Framer Prototyping

For a complete overview, downloads and docs please visit [framerjs.com](http://www.framerjs.com). Find the latest builds at [builds.framerjs.com](http://builds.framerjs.com)

#### Building

- Download or clone the code
- Run `npm install` to get the dependencies
- Run `make build` to build the latest version

#### Testing

- Run `make test` to run the unit tests in phantomjs
- Run `make safari` to run the tests in Safari
- Download Cactus and open extras/CactusFramer, then go to /test.html for a list of visual tests.

#### Reporting Issues

- Please use the issue tracker and tag them with Framer3
- Try to include an example and clearly describe expected behaviour

[![wercker status](https://app.wercker.com/status/8e5d02248bfd387acebdf177fba5f6b1/m "wercker status")](https://app.wercker.com/project/bykey/8e5d02248bfd387acebdf177fba5f6b1)

## Framer 3 Changes

Framer 3 is close to a rewrite. Or maybe more a huge refactor. The new code base is simpler and very well tested, so I hope others can start contributing more easily.

#### New Features

- State machine
  - A proper way to organize animations
  - Define a set of states with myLayer.states.add "name", {properties...}
  - Transform to a specific state with myLayer.states.switch "name" or myLayer.states.next()
  - Optionally override layer.states.animationOptions, or pass them in 
- Animation backend
  - Based on requestAnimationFrame
  - Allows for more precise animation handling and better control
  - Allows to change animations in-flight, which is required for real physics
  - Animations now take a new argument curveOptions that can contain named inputs (like spring, tension, velocity) rather than the old curve "spring(x,y,z)" argument.
- Animators
  - Added damping harmonic oscillator spring physics (curve: "spring-dho")
  - Very simple infrastructure to add your own animators:
    - Emit a number on a tick
    - Check if the animation has reached it's end
    - Support for future advanced animators like real physics and path animators

#### Big Changes

- Views are now called Layers (superLayer, subLayers, etc)
- Layers get a default background color and width, height on default so you can see them
- You can override the defaults yourself like Framer.Defaults.Layer.width = 100
- Layer events (myLayer.on) have a modified scope where this is the layer it's being called on
- There is no ScrollLayer, it's just a Layer. You can enable scrolling with scroll, scrollX, scrollY (and animate them).
- There is no ImageLayer, it's just a Layer. Set the image with myLayer.image = "url"

#### Smaller Changes

- More sane error checking all around, throwing sensible errors if you do something wrong
- Transform origin are now full properties: Layer.originX, Layer.originY
- Most objects have a nice .toString() method for debugging
- Added delay and repeat keywords to animation
- Animation events now also get emitted on the layer (start, stop, end)
- Replaces the Underscore library with Lodash and added Underscore.String
- Some css properties are now directly exposed on the layer (without having to go through .style) like backgroundColor
- Added Utils.mapRange to map from one number range to another. So 0.5 as input from 0-1 to 0-50 becomes 25.

#### Big bugs fixed

- A lot of stuff around animations
  - Reliable event handling (start, stop, end)
  - Multiple animations for one layer
- Rotation issues beyond 360 degrees
- Rewritten the Photoshop importer with tests

#### Backwards Compatibility

- View, ScrollView and ImageView should work, but they give a warning.
- Animation spring initial velocity behaves a bit different

#### Known Issues

- Rotation issues with a low z-index cause drawing issues.
- Animation perf in some versions of Chrome seems less good than Framer 2 (maybe fixed)
- The blur (and likely other filter properties) are kind of broken on Chrome

#### Plans

- Add back in the css keyframe animation backend and allow to switch between them on a per animation basis.
- Add more animatable properties. You can set layer.style as an animation target and animate it's numeric css properties. - We'll have to put some converters in to tween between colors, gradients, shadows, etc.
- Add back in the box2d physics engine and come up with a testable api
- Research FF/IE support

#### Framer 3 Release Todo

- Add a Framer.Future namespace to try new stuff

