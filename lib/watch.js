(function() {
  var Promise, PromiseBurst, Watcher, directory, file, path, saigaDir, saigaFs, _ref;

  saigaFs = require('./fs');

  saigaDir = require('./directory');

  file = require('./file');

  path = require('./path');

  _ref = require('nyala'), Promise = _ref.Promise, PromiseBurst = _ref.PromiseBurst;

  Watcher = (function() {

    Watcher.prototype.interval = 100;

    function Watcher(fn) {
      this.fn = fn;
      this.start();
    }

    Watcher.prototype.start = function() {
      var callFn;
      var _this = this;
      this.lastChanged = false;
      callFn = function() {
        return _this.fn.apply(_this);
      };
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
      var _this = this;
      fileName = path.escape(fileName);
      findLastChanged = file.lastChanged(fileName);
      findLastChanged.kept(function(actualLastChanged) {
        if (_this.lastChanged !== false && actualLastChanged > _this.lastChanged) {
          callback();
        }
        if (actualLastChanged > _this.lastChanged || _this.lastChanged === false) {
          return _this.lastChanged = actualLastChanged;
        }
      });
      return findLastChanged.execute();
    });
  };

  directory = function(directory, callback) {
    return new Watcher(function() {
      var findLastChanged;
      var _this = this;
      directory = path.escape(directory);
      findLastChanged = saigaDir.lastChanged(directory);
      findLastChanged.kept(function(actualLastChanged, changedFile) {
        if (_this.lastChanged !== false && actualLastChanged > _this.lastChanged) {
          callback(changedFile);
        }
        if (actualLastChanged > _this.lastChanged || _this.lastChanged === false) {
          return _this.lastChanged = actualLastChanged;
        }
      });
      return findLastChanged.execute();
    });
  };

  module.exports = {
    directory: directory,
    file: file
  };

}).call(this);
