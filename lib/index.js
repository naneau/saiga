(function() {
  module.exports = {
    fs: require('./fs'),
    file: require('./file'),
    directory: require('./directory'),
    watch: require('./watch'),
    find: require('./find')
  };
}).call(this);
