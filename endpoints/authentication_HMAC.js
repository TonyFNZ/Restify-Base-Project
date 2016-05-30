module.exports = function(server) {
  var module = {};

  var jwt = require('jsonwebtoken');
  var SECRET = 'abc123';


  server.post('/login', function(req, res, next) {
    console.log('In Login Function');

    var username = req.params.username;
    var password = req.params.password;

    if(username != 'tonyf' || password != 'Password1') {
      res.send(401);
    } else {

      var options = {
        subject: '123',
        expiresIn: '10h',
        audience: 'invenco:cloud',
        issuer: 'https://cloud.invenco.com'
      }
      var token = jwt.sign( {}, SECRET, options);

      res.send(token);
    }
  });


  server.get('/authcheck', function(req, res, next) {
    var token = req.headers.authorization.split(' ')[1];

    var options = {
      ignoreExpiration: true
    };
    try {
      var decoded = jwt.verify(token, SECRET, options);

      console.log(decoded);
      res.send(decoded);

    } catch(err) {
      console.log(err);
      res.send(401);
    }
  });


  console.log('HMAC authentication endpoint loaded');
  return module; // public methods
}
