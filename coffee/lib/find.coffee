# Find wraps around regular ol' find
{Promise, PromiseBurst, PromiseChain} = require 'nyala'

# Exec
{exec} = require 'child_process'

# Find all from
all = (directory) -> new Promise ->
    exec "find #{directory}", (error, stdout, stderr) =>
        return @break error if error?
        @keep (file for file in stdout.split "\n" when file.length > 0)

# List files in a directory, wraps around regular ol' "find"
byName = (directory, mask) -> new Promise ->
    exec "find #{directory} -name #{mask}", (error, stdout, stderr) =>
        return @break error if error?
        @keep (file for file in stdout.split "\n" when file.length > 0)

# Export
module.exports = {all, byName}