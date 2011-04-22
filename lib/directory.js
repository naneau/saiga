(function() {
  var Promise, PromiseBurst, PromiseChain, find, findSubDirectories, fs, isDirectory, lastChanged, saigaFs, _ref;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  _ref = require('nyala'), Promise = _ref.Promise, PromiseBurst = _ref.PromiseBurst, PromiseChain = _ref.PromiseChain;
  fs = require('fs');
  saigaFs = require('./fs');
  find = require('./find');
  isDirectory = function(fileName) {
    return new Promise(function() {
      var stat;
      stat = saigaFs.stat(fileName);
      stat.kept(__bind(function() {
        return this.keep(stat.isDirectory());
      }, this));
      stat.broken(__bind(function(err) {
        return this["break"](err);
      }, this));
      return stat.execute();
    });
  };
  findSubDirectories = function(rootDirectory) {
    return new Promise(function() {
      return fs.readdir(rootDirectory, __bind(function(error, files) {
        var burst, file, _fn, _i, _len;
        if (error != null) {
          this["break"](error);
        }
        burst = new PromiseBurst;
        _fn = function(file) {
          return burst.add;
        };
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          _fn(file);
        }
        burst.kept(__bind(function() {
          var directories;
          directories = [];
          burst.eachResult(function(directory) {
            if (directory != null) {
              return files.push(directory);
            }
          });
          return this.keep(directories);
        }, this));
        return burst.broken(function(error) {
          return this["break"](error);
        });
      }, this));
    });
  };
  lastChanged = function(directory) {
    return new Promise(function() {
      var files;
      files = find.all(directory);
      files.kept(__bind(function(files) {
        var burst, file, _fn, _i, _len;
        burst = new PromiseBurst;
        _fn = function(file) {
          return burst.add(saigaFs.stat(file));
        };
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          _fn(file);
        }
        burst.kept(__bind(function() {
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
          return this.keep(actualChange, lastFile);
        }, this));
        burst.broken(__bind(function(error) {
          return this["break"](error);
        }, this));
        return burst.execute();
      }, this));
      files.broken(__bind(function(error) {
        return this["break"](error);
      }, this));
      return files.execute();
    });
  };
  module.exports = {
    isDirectory: isDirectory,
    findSubDirectories: findSubDirectories,
    lastChanged: lastChanged
  };
}).call(this);
