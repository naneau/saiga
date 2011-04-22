(function() {
  var Promise, PromiseBurst, PromiseChain, find, findAndCombine, fs, read, saigaFs, write, _ref;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  _ref = require('nyala'), Promise = _ref.Promise, PromiseBurst = _ref.PromiseBurst, PromiseChain = _ref.PromiseChain;
  saigaFs = require('./fs');
  find = require('./find');
  fs = require('fs');
  read = function(fileName, encoding) {
    if (encoding == null) {
      encoding = 'utf8';
    }
    return new Promise(function() {
      return fs.readFile(fileName, encoding, __bind(function(error, contents) {
        if (error != null) {
          return this["break"](error);
        }
        return this.keep(contents);
      }, this));
    });
  };
  write = function(fileName, contents, encoding) {
    return new Promise(function() {
      return fs.writeFile(fileName, contents, encoding, __bind(function(error) {
        if (error != null) {
          return this["break"](error);
        }
        return this.keep(fileName, contents);
      }, this));
    });
  };
  findAndCombine = function(directory, name) {
    if (name == null) {
      name = false;
    }
    return new Promise(function() {
      var chain;
      chain = new PromiseChain;
      if (name === false) {
        chain.add(find.all(directory));
      } else {
        chain.add(find.byName(directory, name));
      }
      chain.add(function(files) {
        var file, readBurst, _i, _len;
        readBurst = new PromiseBurst;
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          readBurst.add(read(file));
        }
        readBurst.kept(__bind(function() {
          return this.keep(readBurst.addResults(''));
        }, this));
        readBurst.broken(__bind(function(error) {
          return this["break"](error);
        }, this));
        return readBurst.execute();
      });
      this.dependOn(chain);
      return chain.execute();
    });
  };
  module.exports = {
    read: read,
    write: write,
    findAndCombine: findAndCombine
  };
}).call(this);
