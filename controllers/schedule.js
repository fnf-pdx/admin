'use strict';

var moment = require('moment-timezone');

module.exports = function(events, teams) {
  return function(request, reply) {
    var show = request.payload.show;
    var team1 = request.payload.team1;
    var team2 = request.payload.team2;
    var timestamp = moment(request.payload.date, 'American/Los_Angeles').unix().toString();

    var event = {
      show: {S: show},
      team1: {S: team1},
      team2: {S: team2},
      timestamp: {N: timestamp}
    };

    events.create(event, function(err) {
      if (err) {
        console.log(err);
        return reply.redirect('/');
      }

      teams.removeFromWaitingList(team1, function(err) {
        if (err) {
          console.log(err);
          return reply.redirect('/');
        }

        teams.removeFromWaitingList(team2, function(err) {
          if (err) {
            console.log(err);
            return reply.redirect('/');
          }

          teams.moveWaitingList(show, '2', function(err) {
            if (err) {
              console.log(err);
              return reply.redirect('/');
            }

            return reply.redirect('/');
          });
        });
      });
    });
  };
};