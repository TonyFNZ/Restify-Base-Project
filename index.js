
var restify = require('restify');
var jwt = require('restify-jwt');
var fs = require('fs');
var bunyan = require('bunyan');



var server = restify.createServer({
  name: 'Test Server'
});
server.log.level = "info";


server.use(restify.bodyParser()); // puts body under req.params and req.body
server.use(restify.requestLogger());


server.on('after', function(req, res, route, error){
  // Delete sensitive fields before the audit logger runs
  if(req.body.password) {
    delete req.body.password;
  }
});

server.on('after', restify.auditLogger({
  log: bunyan.createLogger({
    name: 'audit',
    stream: process.stdout
  }),
  body: true
}));


server.on('NotImplementedError', function (req, res, err, cb) {
  err.body = 'Augmenting the error';
  return cb();
});

var hello = require('./endpoints/hello')(server);


server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
