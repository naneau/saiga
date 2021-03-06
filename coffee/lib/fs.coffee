# Promises and such
{Promise, PromiseBurst, PromiseChain} = require 'nyala'

Path = require './path'

# Node's FS
fs = require 'fs'

# Stat a file
stat = (fileName) -> new Promise ->

    fileName = Path.escape fileName

    fs.stat fileName, (statError, statData) =>
        return @break statError if statError?
        @keep statData, fileName

# I can has stat?
canStat = (fileName) -> new Promise -> fs.stat fileName, (statError, statData) => @keep not statError?, fileName

# Exports
module.exports = {stat, canStat}
