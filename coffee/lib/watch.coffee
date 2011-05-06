# Fs
saigaFs = require './fs'
saigaDir = require './directory'
file = require './file'

# Promise burst
{Promise, PromiseBurst} = require 'nyala'

# Change Watcher
class Watcher
    
    # Interval for checking
    interval: 100
    
    # Constructor, @fn will be scoped to the Watcher instance
    constructor: (@fn) -> 
        @lastChanged = false
        do @start
        
    # Start watching
    start: -> 
        callFn = => @fn.apply this
        @interval = setInterval callFn, Watcher::interval

    # Stop watching
    stop: -> clearInterval @interval

# Watch a file for changes
# we don't use Node's fs.watchFile for this
file = (fileName, callback) -> new Watcher ->
    findLastChanged = file.lastChanged fileName
    findLastChanged.kept (actualLastChanged) =>
        do callback if @lastChanged isnt false and actualLastChanged > @lastChanged
        @lastChanged = actualLastChanged if actualLastChanged > @lastChanged or @lastChanged is false            
    
    do findLastChanged.execute
    
# Watch a directory, and call callback if any file in it changes
directory = (directory, callback) -> new Watcher ->
    findLastChanged = saigaDir.lastChanged directory
    findLastChanged.kept (actualLastChanged, changedFile) =>
        do callback if @lastChanged isnt false and actualLastChanged > @lastChanged
        @lastChanged = actualLastChanged if actualLastChanged > @lastChanged or @lastChanged is false            
                
    do findLastChanged.execute

module.exports = {directory, file}