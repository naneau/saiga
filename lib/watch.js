(function() {
  var Promise, PromiseBurst, Watcher, directory, saigaDir, saigaFs, _ref;
  saigaFs = require('./fs');
  saigaDir = require('./directory');
  _ref = require('nyala'), Promise = _ref.Promise, PromiseBurst = _ref.PromiseBurst;
  Watcher = (function() {
    function Watcher(fn) {
      this.fn = fn;
      this.start();
    }
    Watcher.prototype.start = function() {
      return this.interval = setInterval(this.fn, 100);
    };
    Watcher.prototype.stop = function() {
      return clearInterval(this.interval);
    };
    return Watcher;
  })();
  directory = function(directory, callback) {
    var lastChange;
    lastChange = false;
    return new Watcher(function() {
      var lastChanged;
      lastChanged = saigaDir.lastChanged(directory);
      lastChanged.kept(function(actualLastChanged, changedFile) {
        if (actualLastChanged > lastChange) {
          if (lastChange === false) {
            lastChange = actualLastChanged;
          }
          if (actualLastChanged > lastChange) {
            lastChange = actualLastChanged;
            return callback();
          }
        }
      });
      return lastChanged.execute();
    });
  };
  module.exports = {
    directory: directory
  };
}).call(this);
