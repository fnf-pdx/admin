'use strict';

var Bcrypt = require('bcrypt');
var Hapi = require('hapi');
var Good = require('good');
var Basic = require('hapi-auth-basic');

var version = require('./package').version;

var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
var ddb = new AWS.DynamoDB();

var models = require('fnf-models');
var schedule = models.schedule(ddb);

var calendarController = require('./controllers/calendar')(schedule);

var users = {
  admin: {
    username: 'admin',
    password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm',   // 'secret'
    name: 'admin',
    id: '1'
  }
};

var validate = function (request, username, password, callback) {
  var user = users[username];
  if (!user) {
    return callback(null, false);
  }

  Bcrypt.compare(password, user.password, function (err, isValid) {
    callback(err, isValid, { id: user.id, name: user.name });
  });
};

var server = new Hapi.Server();
server.connection({ port: 8000 });

var swig = require('swig');

swig.setDefaults({
  cache: false
});

server.views({
  engines: {
    html: swig
  },
  path: './views'
});

server.register([
  {
    register: Good,
    options: {
      reporters: [{
        reporter: require('good-console'),
        events: {
          response: '*',
          log: '*'
        }
      }]
    }
  },
  {
    register: Basic
  }
], function (err) {
  if (err) {
    throw err;
  }

  server.auth.strategy('simple', 'basic', { validateFunc: validate });

  server.route({
    method: 'GET',
    path: '/health-check',
    handler: function(request, reply) {
      reply({ status: 'ok', version: version });
    }
  });

  server.route({
    method: 'GET',
    path: '/bower_components/{param*}',
    handler: {
      directory: {
        path: 'bower_components'
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/',
    config: {
      auth: 'simple',
      handler: calendarController
    }
  });

  server.route({
    method: 'GET',
    path: '/{month}',
    config: {
      auth: 'simple',
      handler: calendarController
    }
  });

  server.start(function () {
    server.log('info', 'Server running at: ' + server.info.uri);
  });
});
