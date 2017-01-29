import * as assert from "assert"

import {AnimationLoop} from "AnimationLoop"

it("should schedule", () => {

    let loop = new AnimationLoop()
    let count = 0
    const f = () => count++

    loop.schedule("render", f)
    loop.schedule("render", f)
    loop.schedule("render", f)

    assert.equal(loop.listeners("render").length, 1)

    loop.emit("render")
    loop.emit("render")

    assert.equal(count, 1)
})
