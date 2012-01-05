# Promises and such
{Promise, PromiseBurst, PromiseChain} = require 'nyala'

Path = require './path'

# Saiga's fs
saigaFs = require './fs'

# Find
find = require './find'

# Node fs
fs = require 'fs'

# Read a file
read = (fileName, encoding = 'utf8') -> new Promise ->

    fileName = Path.escape fileName

    fs.readFile fileName, encoding, (error, contents) =>
        return @break error if error?
        @keep contents, fileName

# Write a file
write = (fileName, contents, encoding) -> new Promise ->

    fileName = Path.escape fileName

    fs.writeFile fileName, contents, encoding, (error) =>
        return @break error if error?
        @keep contents, fileName

# Last changed for a file, returns a JS Date object
lastChanged = (fileName) -> new Promise ->

    fileName = Path.escape fileName

    fs.stat fileName, (error, stat) =>
        return @break error if error?
        @keep new Date stat.mtime

# Find all files in a directory and combine them into a single string
findAndCombine = (directory, name = false) -> new Promise ->

    directory = Path.escape directory

    # For our own promise we depend on a chain's
    chain = new PromiseChain
    @dependOn chain

    # Find the relevant files
    if name is false
        chain.add find.all directory
    else
        chain.add find.byName directory, name

    # Combine them
    chain.add (files) ->
        # Combine all files in a burst
        readBurst = new PromiseBurst
        readBurst.add read file for file in files

        # Write to the combination file with all js assets combined
        readBurst.kept () =>
            combined = '';
            readBurst.eachResult (contents, fileName) -> combined += contents
            @keep combined

        # Or fail if we can't
        readBurst.broken (error) => @break error

        do readBurst.execute


    # Execute the chain
    do chain.execute

module.exports = {read, write, findAndCombine}
