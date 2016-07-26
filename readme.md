[![wercker status](https://app.wercker.com/status/8e5d02248bfd387acebdf177fba5f6b1/s/master "wercker status")](https://app.wercker.com/project/bykey/8e5d02248bfd387acebdf177fba5f6b1)

# Framer.js

**Framer.js** is an open source JavaScript framework for rapid prototyping.
Framer.js allows you to define animations and interactions, complete with filters, spring physics, 3D effects and more. It's bundled with **Framer Generator**, an application that allows you to import layers directly out of Photoshop and Sketch.

[Framer Studio](http://framerjs.com) is a prototyping app for Mac, based on Framer.js. Framer Studio includes an editor based on CoffeeScript, instant visual feedback and much more.

[Join the group](https://www.facebook.com/groups/framerjs/) at Facebook for help, ideas and general prototyping talk. Also feel free to post your work.

## Get Started

- [Download] (https://builds.framerjs.com/latest/Framer.zip) (Framer.js & Framer Generator)
- Open **index.html** in a WebKit browser and you'll see an image animate on click
- Edit the **app.js** to add interactions and animations (see example code below)

![Folder Screenshot](http://f.cl.ly/items/0P2m0f0v1X2U2E0J0I2i/ss2.png)

## Example
###### Define a layer and center it
```javascript
imageLayer = new Layer({width:128, height:128, image:"images/icon.png"})
imageLayer.center()
```
###### Add states
```javascript  
imageLayer.states = {
	second: {y:100, scale:0.6, rotationZ:100},
	third:  {y:300, scale:1.3},
	fourth:	{y:200, scale:0.9, rotationZ:200}
}
```
###### Set default animation options
```javascript
imageLayer.options = {
	curve: "spring(500,12,0)"
}
```
###### Toggle states on click
```javascript
imageLayer.onClick(function(event) {
	imageLayer.animateToNext()
})
```
#### Features
- Spring Physics, Easing Functions and Bezier Curves
- Hardware Accelerated (3D) Animations with 60fps
- Events: Click, Touch, Drag, Scroll and more
- State Machine to define and animate between sets of properties
- Import from Sketch & Photoshop with Framer Generator
- Based on WebKit: works on desktop, mobile and tablets
- Debugging with Web Inspector and JavaScript console


## Framer Generator
With a Sketch or Photoshop file open, open Framer Generator and click **Import**. Only layer groups are imported; single layers are ignored. The hierarchy of your layer groups is respected.

You can safely move things around in Sketch or Photoshop and re-import. Generator will update the images and any changes in hierarchy, but leave your code intact. [See our documentation](http://framerjs.com/learn/import/) for more.

- Access any layer by its group name
- Groups within groups will become subLayers
- Groups with vector masks will become clipped layers
- Group names should be unique (otherwise, they'll be renamed)


## Contribute

Check the [wanted features wiki page](https://github.com/koenbok/Framer/wiki/Contributing:-Wanted-Features) for ideas to work on.

##### Building

- Download or clone the code
- Make sure you have node and npm >= 2 installed
- Run `make dist` to build the latest version
- Run `make` to rebuild the latest version on changes

##### Testing

- Run `make test` to run the unit tests in phantomjs
- Run `make` to retest the latest version on changes

There are also a set of visual and interactive tests for Framer Studio which you can find in test/studio.

##### Reporting Issues

- Please use the issue tracker
- Try to include an example and clearly describe expected behaviour


## More
- [Framer Studio](http://framerjs.com) - Prototyping application for OS X, built on Framer
- [Latest Builds](http://builds.framerjs.com) - Latest builds of Framer.js
- [Framer 3 Changes](https://github.com/koenbok/Framer/wiki/Framer-3-Changes) - What's new in Framer 3
