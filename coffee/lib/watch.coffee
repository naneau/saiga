# Fs
saigaFs = require './fs'
saigaDir = require './directory'
file = require './file'
path = require './path'

# Promise burst
{Promise, PromiseBurst} = require 'nyala'

# Change Watcher
class Watcher

    # Interval for checking
    interval: 100

    # Constructor, @fn will be scoped to the Watcher instance
    constructor: (@fn) -> do @start

    # Start watching
    start: ->
        # reset lastchanged
        @lastChanged = false

        callFn = => @fn.apply this
        @interval = setInterval callFn, Watcher::interval

    # Stop watching
    stop: -> clearInterval @interval

# Watch a file for changes
# we don't use Node's fs.watchFile for this
file = (fileName, callback) -> new Watcher ->
    fileName = path.escape fileName

    findLastChanged = file.lastChanged fileName
    findLastChanged.kept (actualLastChanged) =>
        do callback if @lastChanged isnt false and actualLastChanged > @lastChanged
        @lastChanged = actualLastChanged if actualLastChanged > @lastChanged or @lastChanged is false

    do findLastChanged.execute

# Watch a directory, and call callback if any file in it changes
directory = (directory, callback) -> new Watcher ->

    directory = path.escape directory

    # Find the last changed mtime in the dir
    findLastChanged = saigaDir.lastChanged directory

    # Once we find that changed mtime, compare it and call the callback with the changed file
    findLastChanged.kept (actualLastChanged, changedFile) =>

        callback changedFile if @lastChanged isnt false and actualLastChanged > @lastChanged

        @lastChanged = actualLastChanged if actualLastChanged > @lastChanged or @lastChanged is false

    do findLastChanged.execute

module.exports = {directory, file}
