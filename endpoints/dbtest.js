module.exports = function(server) {
  var restify = require('restify');


  server.get('/company/:id', function(req, res, next) {
    var companyId = req.params.id;
    var queryStr = 'SELECT id, name, created, active '
                 + 'FROM company WHERE id = $1::int;';

    server.db.readquery(queryStr, [companyId], function(err, result){
        if(err) {
          res.send(err);
          return next();
        }

        if(result.rows.length < 1) {
          res.send(404, 'Company not found');
        } else {
          res.send(result.rows[0]);
        }
        return next();
      }
    );
  });


  server.post('/company', function(req, res, next) {
    var name = req.params.name;
    var queryStr = 'INSERT INTO company (name, created, active) '
                 + 'VALUES ($1, now(), true) '
                 + 'RETURNING id, name, created, active;';

    server.db.writequery(queryStr, [name],
      function(err, result){
        if(err) {
          res.send(err);
          return next();
        }

        if(result.rows.length < 1) {
          res.send(500, 'Failed to create company');
        } else {
          res.send(result.rows[0]);
        }
        return next();
      }
    );
  });

  server.log.info('DB test endpoint loaded');
  return {}; // public methods/properties
}
