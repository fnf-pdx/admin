'use strict';

var moment = require('moment-timezone');

module.exports = function(input, offset) {
  return input.clone().add(offset, 'month');
};

