module.exports = function(server) {
  var module = {};

  var jwt = require('jsonwebtoken');
  var fs = require('fs');

  var PRIVATE_KEY = fs.readFileSync('endpoints/keys/key.pem');
  var PUBLIC_KEY =  fs.readFileSync('endpoints/keys/cert.pem');


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
        algorithm: 'RS256',
        issuer: 'https://cloud.invenco.com'
      }
      var token = jwt.sign( {name: 'Tony'}, PRIVATE_KEY, options);

      res.send(token);
    }
  });


  server.get('/authcheck', function(req, res, next) {
    var token = req.headers.authorization.split(' ')[1];

    var options = {
      ignoreExpiration: true
    };
    try {
      var decoded = jwt.verify(token, PUBLIC_KEY, options);

      console.log(decoded);
      res.send(decoded);

    } catch(err) {
      console.log(err);
      res.send(401);
    }
  });


  console.log('RSA authentication endpoint loaded');
  return module; // public methods
}
