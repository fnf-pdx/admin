'use strict';

var moment = require('moment-timezone');
var chunk = require('lodash/array/chunk');
var get = require('lodash/object/get');
var filter = require('lodash/collection/filter');

module.exports = function(month, events) {
  var daysInMonth = month.daysInMonth();
  var dayOfMonth = 1;
  var days = [];
  var weeks;

  for (dayOfMonth; dayOfMonth <= daysInMonth; dayOfMonth++) {
    days.push({
      index: dayOfMonth
    });
  }

  events.map(function(event) {
    var dayOfMonth = moment.tz(event.date.S, 'America/Los_Angeles').format('D');
    days[dayOfMonth-1].event = event;
  });

  weeks = chunk(days, 7);

  return weeks;
};
