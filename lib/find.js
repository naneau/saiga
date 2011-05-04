(function() {
  var Promise, PromiseBurst, PromiseChain, all, byName, exec, _ref;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  _ref = require('nyala'), Promise = _ref.Promise, PromiseBurst = _ref.PromiseBurst, PromiseChain = _ref.PromiseChain;
  exec = require('child_process').exec;
  all = function(directory) {
    return new Promise(function() {
      return exec("find " + directory, __bind(function(error, stdout, stderr) {
        var file;
        if (error != null) {
          return this["break"](error);
        }
        return this.keep((function() {
          var _i, _len, _ref2, _results;
          _ref2 = stdout.split("\n");
          _results = [];
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            file = _ref2[_i];
            if (file.length > 0) {
              _results.push(file);
            }
          }
          return _results;
        })());
      }, this));
    });
  };
  byName = function(directory, mask) {
    return new Promise(function() {
      return exec("find " + directory + " -name " + mask, __bind(function(error, stdout, stderr) {
        var file;
        if (error != null) {
          return this["break"](error);
        }
        return this.keep((function() {
          var _i, _len, _ref2, _results;
          _ref2 = stdout.split("\n");
          _results = [];
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            file = _ref2[_i];
            if (file.length > 0) {
              _results.push(file);
            }
          }
          return _results;
        })());
      }, this));
    });
  };
  module.exports = {
    all: all,
    byName: byName
  };
}).call(this);
