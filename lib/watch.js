(function() {
  var Promise, PromiseBurst, Watcher, directory, file, saigaDir, saigaFs, _ref;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  saigaFs = require('./fs');
  saigaDir = require('./directory');
  file = require('./file');
  _ref = require('nyala'), Promise = _ref.Promise, PromiseBurst = _ref.PromiseBurst;
  Watcher = (function() {
    Watcher.prototype.interval = 100;
    function Watcher(fn) {
      this.fn = fn;
      this.lastChanged = false;
      this.start();
    }
    Watcher.prototype.start = function() {
      var callFn;
      callFn = __bind(function() {
        return this.fn.apply(this);
      }, this);
      return this.interval = setInterval(callFn, Watcher.prototype.interval);
    };
    Watcher.prototype.stop = function() {
      return clearInterval(this.interval);
    };
    return Watcher;
  })();
  file = function(fileName, callback) {
    return new Watcher(function() {
      var findLastChanged;
      findLastChanged = file.lastChanged(fileName);
      findLastChanged.kept(__bind(function(actualChange) {
        if (actualLastChanged > lastChange && this.lastChanged !== false) {
          callback();
        }
        if (actualChange > this.lastChanged || this.lastChanged === false) {
          return this.lastChanged = actualChange;
        }
      }, this));
      return findLastChanged.execute();
    });
  };
  directory = function(directory, callback) {
    return new Watcher(function() {
      var findLastChanged;
      findLastChanged = saigaDir.lastChanged(directory);
      findLastChanged.kept(__bind(function(actualLastChanged, changedFile) {
        if (actualLastChanged > lastChange && this.lastChanged !== false) {
          callback();
        }
        if (actualChange > this.lastChanged || this.lastChanged === false) {
          return this.lastChanged = actualChange;
        }
      }, this));
      return findLastChanged.execute();
    });
  };
  module.exports = {
    directory: directory,
    file: file
  };
}).call(this);
