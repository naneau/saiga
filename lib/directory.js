(function() {
  var Promise, PromiseBurst, PromiseChain, find, findSubDirectories, fs, isDirectory, lastChanged, path, saigaFs, _ref;

  _ref = require('nyala'), Promise = _ref.Promise, PromiseBurst = _ref.PromiseBurst, PromiseChain = _ref.PromiseChain;

  fs = require('fs');

  saigaFs = require('./fs');

  find = require('./find');

  path = require('./path');

  isDirectory = function(fileName) {
    return new Promise(function() {
      var stat;
      var _this = this;
      stat = saigaFs.stat(fileName);
      stat.kept(function() {
        return _this.keep(stat.isDirectory());
      });
      stat.broken(function(err) {
        return _this["break"](err);
      });
      return stat.execute();
    });
  };

  findSubDirectories = function(rootDirectory) {
    return new Promise(function() {
      var _this = this;
      return fs.readdir(rootDirectory, function(error, files) {
        var burst, file, _fn, _i, _len;
        if (error != null) _this["break"](error);
        burst = new PromiseBurst;
        _fn = function(file) {
          return burst.add;
        };
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          _fn(file);
        }
        burst.kept(function() {
          var directories;
          directories = [];
          burst.eachResult(function(directory) {
            if (directory != null) return files.push(directory);
          });
          return _this.keep(directories);
        });
        return burst.broken(function(error) {
          return this["break"](error);
        });
      });
    });
  };

  lastChanged = function(directory) {
    return new Promise(function() {
      var files;
      var _this = this;
      files = find.all(directory);
      files.kept(function(files) {
        var burst, file, _fn, _i, _len;
        burst = new PromiseBurst;
        _fn = function(file) {
          return burst.add(saigaFs.stat(file));
        };
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          _fn(file);
        }
        burst.kept(function() {
          var actualChange, lastFile;
          actualChange = new Date(0);
          lastFile = '';
          burst.eachResult(function(stat, file) {
            var date;
            date = new Date(stat.mtime);
            if (date > actualChange) {
              actualChange = date;
              return lastFile = file;
            }
          });
          return _this.keep(actualChange, lastFile);
        });
        burst.broken(function(error) {
          return _this["break"](error);
        });
        return burst.execute();
      });
      files.broken(function(error) {
        return _this["break"](error);
      });
      return files.execute();
    });
  };

  module.exports = {
    isDirectory: isDirectory,
    findSubDirectories: findSubDirectories,
    lastChanged: lastChanged
  };

}).call(this);
