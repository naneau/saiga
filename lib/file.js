(function() {
  var Path, Promise, PromiseBurst, PromiseChain, find, findAndCombine, fs, lastChanged, read, saigaFs, write, _ref;

  _ref = require('nyala'), Promise = _ref.Promise, PromiseBurst = _ref.PromiseBurst, PromiseChain = _ref.PromiseChain, Path = _ref.Path;

  saigaFs = require('./fs');

  find = require('./find');

  fs = require('fs');

  read = function(fileName, encoding) {
    if (encoding == null) encoding = 'utf8';
    return new Promise(function() {
      var _this = this;
      fileName = Path.escape(fileName);
      return fs.readFile(fileName, encoding, function(error, contents) {
        if (error != null) return _this["break"](error);
        return _this.keep(contents, fileName);
      });
    });
  };

  write = function(fileName, contents, encoding) {
    return new Promise(function() {
      var _this = this;
      fileName = Path.escape(fileName);
      return fs.writeFile(fileName, contents, encoding, function(error) {
        if (error != null) return _this["break"](error);
        return _this.keep(contents, fileName);
      });
    });
  };

  lastChanged = function(fileName) {
    return new Promise(function() {
      var _this = this;
      fileName = Path.escape(fileName);
      return fs.stat(fileName, function(error, stat) {
        if (error != null) return _this["break"](error);
        return _this.keep(new Date(stat.mtime));
      });
    });
  };

  findAndCombine = function(directory, name) {
    if (name == null) name = false;
    return new Promise(function() {
      var chain;
      directory = Path.escape(directory);
      chain = new PromiseChain;
      this.dependOn(chain);
      if (name === false) {
        chain.add(find.all(directory));
      } else {
        chain.add(find.byName(directory, name));
      }
      chain.add(function(files) {
        var file, readBurst, _i, _len;
        var _this = this;
        readBurst = new PromiseBurst;
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          readBurst.add(read(file));
        }
        readBurst.kept(function() {
          var combined;
          combined = '';
          readBurst.eachResult(function(contents, fileName) {
            return combined += contents;
          });
          return _this.keep(combined);
        });
        readBurst.broken(function(error) {
          return _this["break"](error);
        });
        return readBurst.execute();
      });
      return chain.execute();
    });
  };

  module.exports = {
    read: read,
    write: write,
    findAndCombine: findAndCombine
  };

}).call(this);
