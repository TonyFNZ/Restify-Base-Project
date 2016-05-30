var pg = require('pg');
pg.defaults.parseInt8 = true;
pg.defaults.poolSize = 4;


module.exports = function(config) {

  var writequery = function(query, args, callback) {
    return dbquery('write', query, args, callback);
  };

  var readquery = function(query, args, callback) {
    return dbquery('read', query, args, callback);
  };

  var reportquery = function(query, args, callback) {
    return dbquery('report', query, args, callback);
  };

  var dbquery = function(type, query, args, callback) {
    pg.connect(config.db[type], function(err, client, done) {
      if(err) {
        done(client);
        return callback(err);
      }

      client.query(query, args, function(err, result) {
        done(); //call `done()` to release the client back to the pool

        if(err) {
          return callback(err);
        }
        return callback(null, result);
      });
    });
  };


  return { // public methods/properties
    writequery: writequery,
    readquery: readquery,
    reportquery: reportquery
  };
};
