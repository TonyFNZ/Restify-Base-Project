var pg = require('pg');
pg.defaults.parseInt8 = true;
pg.defaults.poolSize = 4;       // to be configurable



function DBClient( connStr ) {
  this.connStr = connStr;

  this.row = function( query ) {
    pg.connect(connStr, function(err, client, done) {
      if(err) {
        done(client);
        return callback(err);
      }

      client.query(query, args, function(err, result) {
        done(); //call `done()` to release the client back to the pool

        if(err) {
          return callback(err);
        } else if(result.rows.length > 1) {
          return callback('More than one row found');
        } else if(result.rows.length < 1) {
          return callback('No rows found');
        } else {
          return callback(null, result.rows[0]);
        }
      });
    });
  };

  this.rows = function(query) {
    pg.connect(connStr, function(err, client, done) {
      if(err) {
        done(client);
        return callback(err);
      }

      client.query(query, args, function(err, result) {
        done(); //call `done()` to release the client back to the pool

        if(err) {
          return callback(err);
        } else {
          return callback (null, result.rows[0]);
        }
      });
    });
  };

  // TODO exec
}




module.exports = function(config) {

  var writeQuery = function(query, args, callback) {
    return _dbQuery('write', query, args, callback);
  };

  var readQuery = function(query, args, callback) {
    return _dbQuery('read', query, args, callback);
  };

  var reportQuery = function(query, args, callback) {
    return _dbQuery('report', query, args, callback);
  };

  var _dbQuery = function(type, query, args, callback) {
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


  /**
   * Get a raw DB client
   * This should be used where a transaction is required
   */
  var rawClient = function( callback ) {
    pg.connect(config.db.write, function(err, client, done) {
      if(err) {
        done(client);
        return callback(err);
      }

      return callback(null, client, done);
    });
  };


  return { // public methods/properties
    writeQuery:  writeQuery,
    readQuery:   readQuery,
    reportQuery: reportQuery,
    rawClient:   rawClient
  };
};
