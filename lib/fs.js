(function() {
  var Promise, PromiseBurst, PromiseChain, canStat, fs, stat, _ref;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  _ref = require('nyala'), Promise = _ref.Promise, PromiseBurst = _ref.PromiseBurst, PromiseChain = _ref.PromiseChain;
  fs = require('fs');
  stat = function(fileName) {
    return new Promise(function() {
      return fs.stat(fileName, __bind(function(statError, statData) {
        if (statError != null) {
          return this["break"](statError);
        }
        return this.keep(statData, fileName);
      }, this));
    });
  };
  canStat = function(fileName) {
    return new Promise(function() {
      return fs.stat(fileName, __bind(function(statError, statData) {
        return this.keep(!(statError != null), fileName);
      }, this));
    });
  };
  module.exports = {
    stat: stat,
    canStat: canStat
  };
}).call(this);
