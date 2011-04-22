# Promises and such
{Promise, PromiseBurst, PromiseChain} = require 'nyala'

# Node's fs
fs = require 'fs'

# Our own fs stuff :)
saigaFs = require './fs'

# Finding shit
find = require './find'

# Is a file a directory?
isDirectory = (fileName) -> new Promise ->
    stat = saigaFs.stat fileName
    stat.kept () => @keep do stat.isDirectory
    stat.broken (err) => @break err
    do stat.execute
    
# Find subdirectories of a directory
findSubDirectories = (rootDirectory) -> new Promise ->
    fs.readdir rootDirectory, (error, files) =>
        @break error if error?
        
        burst = new PromiseBurst
        for file in files
            do (file) ->
                burst.add 

        # Filter out directories on kept
        burst.kept () =>
            directories = []
            burst.eachResult (directory) -> files.push directory if directory?
            @keep directories
        
        burst.broken (error) -> @break error

# Last mtime for all files in a directory
lastChanged = (directory) -> new Promise ->

    # List all files in directory
    files = find.all directory
    
    # Files found
    files.kept (files) =>

        burst = new PromiseBurst
        for file in files
            do (file) -> burst.add saigaFs.stat file
        
        # Figure out latest change
        burst.kept () =>
            actualChange = new Date 0
            lastFile = ''
            burst.eachResult (stat, file) ->
                date = new Date stat.mtime
                if date > actualChange
                    actualChange = date 
                    lastFile = file
                
            @keep actualChange, lastFile
        
        # Map broken
        burst.broken (error) => @break error
        
        do burst.execute
    
    # Files failed
    files.broken (error) => @break error
    
    do files.execute

module.exports = {isDirectory, findSubDirectories, lastChanged}