var pg = require('pg');
pg.defaults.parseInt8 = true;
pg.defaults.poolSize = 4;

// TODO make this configurable
var CONN_WRITE = 'postgres://restify:Password1@restify-test.cmjf1ycorf8a.ap-southeast-2.rds.amazonaws.com:5432/restify_test_2';
var CONN_READ = 'postgres://restify:Password1@restify-test.cmjf1ycorf8a.ap-southeast-2.rds.amazonaws.com:5432/restify_test_2';
var CONN_REPORT = 'postgres://restify:Password1@restify-test.cmjf1ycorf8a.ap-southeast-2.rds.amazonaws.com:5432/restify_test_2';


module.exports = function(server) {

  server.pre(function(req, res, next) {
    // TODO add db access functions to req
    return next();
  });



  var getConnection = function(callback) {


    pg.connect(CONN_WRITE, function(err, client, done) {
      if(err) {
        done(client);
        return callback(err);
      }

      var complete = function() {
          done();
      }

      return callback(null, client, complete);
    });
  };


  return { // public methods/properties
    getClient: getConnection
  };
}





pg.connect(conString, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('SELECT $1::int AS number', ['1'], function(err, result) {
    //call `done()` to release the client back to the pool
    done();

    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].number);
    //output: 1
  });
});
