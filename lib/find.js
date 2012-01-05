(function() {
  var Path, Promise, PromiseBurst, PromiseChain, all, byName, exec, _ref;

  _ref = require('nyala'), Promise = _ref.Promise, PromiseBurst = _ref.PromiseBurst, PromiseChain = _ref.PromiseChain, Path = _ref.Path;

  exec = require('child_process').exec;

  all = function(directory) {
    return new Promise(function() {
      var _this = this;
      directory = Path.escape(directory);
      return exec("find " + directory, function(error, stdout, stderr) {
        var file;
        if (error != null) return _this["break"](error);
        return _this.keep((function() {
          var _i, _len, _ref2, _results;
          _ref2 = stdout.split("\n");
          _results = [];
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            file = _ref2[_i];
            if (file.length > 0) _results.push(file);
          }
          return _results;
        })());
      });
    });
  };

  byName = function(directory, mask) {
    return new Promise(function() {
      var _this = this;
      directory = Path.escape(directory);
      return exec("find " + directory + " -name " + mask, function(error, stdout, stderr) {
        var file;
        if (error != null) return _this["break"](error);
        return _this.keep((function() {
          var _i, _len, _ref2, _results;
          _ref2 = stdout.split("\n");
          _results = [];
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            file = _ref2[_i];
            if (file.length > 0) _results.push(file);
          }
          return _results;
        })());
      });
    });
  };

  module.exports = {
    all: all,
    byName: byName
  };

}).call(this);
