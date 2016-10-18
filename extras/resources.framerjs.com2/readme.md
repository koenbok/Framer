![Moonbase](http://cl.ly/image/3n3z0u1k2l41/2D1BD7F500000578-3260346-image-a-9_1444040887566.jpg)

### Moonbase

This is a reimplementation of [Cactus](http://github.com/koenbok/Cactus) ideas with [Gulp](http://gulpjs.com). No fancy app, just a command line tool.

#### Quick start

- `git clone https://github.com/motif/Moonbase.git my-project` clone the template into a my-project folder where your site will live.
- `cd my-project` navigate into your project folder.
- `git remote rm origin` to disconnect git from this repository so you can add your own.
- `make` start the default watch task that builds your site and starts a web server that listens for changes.

From this point you will see something like `Serving at: http://localhost:9000` and you can visit the address with your web browser. Every time you make a change, the content will be updated automatically.

#### Goals

- Speed, as larger Cactus projects became slow to work on.
- Portability so everyone can start building right away.
- As simple as possible, but not too simple.
- Less bitrot, projects should keep working for a long time.

#### Features

- Built in server with automatic reloading on changes, based on [Express](http://expressjs.com) and [Live Reload](https://github.com/napcs/node-livereload)
- Template engine (like Django, with extend) based on [Nunjucks](https://mozilla.github.io/nunjucks/) – [Docs](https://mozilla.github.io/nunjucks/templating.html)
- Markdown support (with `{% markdown %}`) based on [Marked](https://github.com/chjj/marked)
- Code highlighting in Markdown, based on [Highlights](https://github.com/atom/highlights)
- Support for SCSS and includes, including minification sourcemaps.
- Support for javascript/coffeescript (with minification and sourcemaps), based on [Webpack](https://webpack.github.io)
- Automatic available port selection for the web server.
- Support for image sprites, based on [SpriteSmith](https://github.com/twolfson/gulp.spritesmith) including [Retina Support](https://github.com/twolfson/gulp.spritesmith/tree/3.5.3#retina-parameters).
- Support for image optimizations [TODO]

#### Project layout

- `Makefile` Shorthands for commands to quickly build or install.
- `config.coffee` Configuration variables like page context function
- `pages` The html pages including site structure.
- `templates` The templates used in the html pages (for extend and include).
- `assets`
	- `static` Just static files like images, fonts and downloads.
	- `css` CSS and SCSS files and dependents. The top level files get compiled.
	- `scripts` javascript/coffeescript files and dependents. The top level files get compiled and minified.
- `package.json` [npm information](https://docs.npmjs.com/files/package.json) about used javascript packages.
- `.build` Path for the generated site (hidden by default).

#### Generated site layout

So you can find this structure in `.build` after a make build command.

- `/pages/index.html` ➝ `/index.html` Rendered template
- `/pages/about/us.html` ➝ `/about/us.html` Rendered template
- `/assets/static/img/image.jpg` ➝ `/assets/static/img/image.jpg` Simple copy
- `/assets/css/style.scss` ➝ `/assets/css/style.css` SCSS compiled
- `/assets/scripts/main.coffee` ➝ `/assets/scripts/main.coffee.js` Coffee compiled and minified
- `/assets/scripts/main.coffee` ➝ `/assets/scripts/main.coffee.map` Coffee sourcemap
- `/assets/scripts/tracker.js` ➝ `/assets/scripts/tracker.js` JavaScript minified
- `/assets/sprites/frontpage/*.png` ➝ `/assets/sprites/frontpage.png` sprite package image

#### SSL

By default, Moonbase uses ssl from 1.7 and up so you can test and find ssl issues before you deploy. Unfortunatily ssl certificates are bound to hosts, so you will have trust the certificates every time you visit a moonbase project/host/port combination for the first time:

- Safari: https://cl.ly/1I0F0Q2k3Q2b
- Chrome: https://cl.ly/0P2a3U1f3H0b

#### Troubleshooting

- You can update node with `brew update; brew upgrade node; npm update -g` (Mac only).
- You can reset your npm packages with `rm -Rf ./node_modules`.

#### Sprites

Every folder within `assets/sprites` will be converted into a sprite package. This will result in an SCSS and image file. The SCSS file will end up in the _project_ folder with the same location as the images. So `assets/sprites/mainpage/*.png` will generate an SCSS file at `assets/sprites/mainpage.scss`. That way you can include it in your main SCSS file and everything will work.

#### Todo

- Better error reporting, especially around the template engine
- Some form of deploying with rsync, s3
- Port blog plugin, add as example
- Build command into separate directory so you don't change it by accident
- Maybe move /subdir/subdir.index.html to /subdir/index.html
- Tests

#### Known issues

- On the Mac, there is a building error with `node-gyp` if you are using a recent node. You can solve it by installing an older version:
	- `brew tap homebrew/versions`
	- `brew install homebrew/versions/node012`
	- `brew switch node 0.12.0`
- If you are upgrading from a Django based system, you need to remove block names from your `endblock` statements: `{% endblock body %}` -> `{% endblock %}`. You can find a handy regex for it [here](https://regex101.com/r/gB4uB9/1).
