module.exports = function(server) {
  var restify = require('restify');

  server.get('/hello/:name', function(req, res, next) {
    res.send('hello ' + req.params.name);
    next();
  });

  server.get('/hello', function(req, res, next) {
    var user = req.user;
    res.send('hello ' + user.name);
    next();
  });

  server.get('/v2/hello/:name', function(req, res, next) {
    var err = new restify.errors.NotImplementedError('This service is not yet implemented');
    return next(err);
  });


  server.post('/hello', function(req, res, next){
    res.send({registered: true});
    next();
  });


  server.log.info('hello endpoint loaded');
  return {}; // public methods/properties
}
