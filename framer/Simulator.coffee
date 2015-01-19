Utils = require "./Utils"

{Config} = require "./Config"

class exports.Simulator

  """
  The simulator class runs a physics simulation based on a set of input values 
  at setup({input values}), and emits an output state {x, v}
  """
  
  constructor: (options={}) ->
    @_state = {x:0, v:0}
    @options = null
    @setup options

  setup: (options) ->
    throw Error "Not implemented"

  next: (delta) ->
    throw Error "Not implemented"

  finished: ->
    throw Error "Not implemented"

  # Assume the caller may change the state object, so best to clone it.
  setState: (state) ->
    @_state =
      x: state.x
      v: state.v

  getState: ->
    state =
      x: @_state.x
      v: @_state.v
    return state

  setOptions: (options={}) ->
    for k, v of options
      @options[k] = v
