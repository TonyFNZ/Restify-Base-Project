
var restify = require('restify');
var jwt = require('restify-jwt');
var fs = require('fs');
var bunyan = require('bunyan');
var config = require('./config');


var server = restify.createServer({
  name: 'Test Server'
});
server.log.level = config.log_level;

var db = require('./db')(config);
server.db = db;


server.use(restify.bodyParser()); // puts body under req.params and req.body
server.use(restify.requestLogger());


server.on('after', function(req, res, route, error){
  // Delete sensitive fields before the audit logger runs
  if(req.body) {
    delete req.body.password;
  }
});
server.on('after', restify.auditLogger({
  log: bunyan.createLogger({
    name: 'audit',
    stream: process.stdout,
    level: config.log_level
  }),
  body: true  // log req/res bodies
}));



var hello = require('./endpoints/hello')(server);
var dbtest = require('./endpoints/dbtest')(server);



server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
