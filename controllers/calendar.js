'use strict';

var moment = require('moment-timezone');
var swig = require('swig');
var filters = require('require-dir')('../filters');

module.exports = function(schedule) {
  swig.setFilter('changeMonth', filters.changeMonth);
  swig.setFilter('addEventsToMonth', filters.addEventsToMonth);

  function getMonth(request) {
    if (request.params.month) {
      return moment.tz(request.params.month, 'America/Los_Angeles');
    }
    return moment().tz('America/Los_Angeles');
  }

  return function render(request, reply) {
    var month = getMonth(request);

    schedule.getShowsForMonth('tnt', month, function(err, events) {
      if (err) {
        console.log(err);
        return reply.view('calendar', {message: 'failed to get events list'});
      }
      return reply.view('calendar', {month: month, events: events});
    });
  };
};