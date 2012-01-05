(function() {
  var Path, Promise, PromiseBurst, PromiseChain, canStat, fs, stat, _ref;

  _ref = require('nyala'), Promise = _ref.Promise, PromiseBurst = _ref.PromiseBurst, PromiseChain = _ref.PromiseChain;

  Path = require('./path');

  fs = require('fs');

  stat = function(fileName) {
    return new Promise(function() {
      var _this = this;
      fileName = Path.escape(fileName);
      return fs.stat(fileName, function(statError, statData) {
        if (statError != null) return _this["break"](statError);
        return _this.keep(statData, fileName);
      });
    });
  };

  canStat = function(fileName) {
    return new Promise(function() {
      var _this = this;
      return fs.stat(fileName, function(statError, statData) {
        return _this.keep(!(statError != null), fileName);
      });
    });
  };

  module.exports = {
    stat: stat,
    canStat: canStat
  };

}).call(this);
