fs = require "fs"

mapA = JSON.parse(fs.readFileSync("build/framer.js.map"))
mapB = JSON.parse(fs.readFileSync("build/framer.min.js.map"))

mapB.sourcesContent = mapA.sourcesContent

fs.writeFileSync("build/framer.min.js.map", JSON.stringify(mapB))