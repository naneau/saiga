exec = (require 'child_process').exec
fs = require 'fs'

# Build
build = (callback) ->
    
    # See, this is one of those places where you could really use a promise chain =]
    
    # Build lib
    cmd = 'coffee -o ./lib -c `find ./coffee/lib -name \\*.coffee`'
    exec cmd, (err, stdout, stderr) ->
        throw new Error "Could not execute #{cmd}" if err?

# Build coffeescript into js
task 'build', 'Build CoffeeScript lib/test into JS lib/test', ->

    console.log 'Building...'
    
    build () ->
        console.log 'Build complete'

# Run nodeunit
task 'test', 'Run tests through nodeunit', ->
    console.log 'Running test suite, building first'
    
    # We need to build first
    build () ->
        console.log 'Build complete, running nodeunit'
        exec "nodeunit test", (err, stdout, stderr) ->
            process.stdout.write stdout