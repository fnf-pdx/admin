'use strict';

var moment = require('moment-timezone');

module.exports = function(teams) {

  return function(request, reply) {
    teams.getWaitingList('Thursday Night Throwdown', function(err, teams) {
      var date = moment().tz('America/Los_Angeles').format('YYYY-MM-DD');
      if (err) {
        console.log(err);
        return reply.view('waiting-list', {message: 'Could not retrieve waiting list'});
      }

      reply.view('dashboard', {date: date, tntWaitingList: teams});
    });
  };
};