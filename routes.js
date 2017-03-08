var api = require('./models/api');


module.exports = {
  configure: function (app) {

    app.post('/auth', function (req, res) {
      api.authenticate(req.body, res);
    });

    app.get('/auth/resource', function (req, res) {
      var token = req.body.token || req.query.token || req.headers['secure-token'];
      req.query.token = token;
      api.getResources(req.query, res);
    });

    app.get('/auth/resource/appts', function (req, res) {
      var token = req.body.token || req.query.token || req.headers['secure-token'];
      req.query.token = token;
      api.getAppts(req.query, res);
    });

    app.get('/auth/resource/appts/appt', function (req, res) {
      var token = req.body.token || req.query.token || req.headers['secure-token'];
      req.query.token = token;
      api.getSingleAppt(req.query, res);
    });

    app.get('/auth/user', function (req, res) {
      var token = req.body.token || req.query.token || req.headers['secure-token'];
      req.query.token = token;
      api.getUsers(req.query, res);
    });

    app.put('/auth/user/email', function (req, res) {
      var token = req.body.token || req.query.token || req.headers['secure-token'];
      req.body.token = token;
      api.updateEmail(req.body, res);
    });

    app.post('/auth/user/create', function (req, res) {
      var token = req.body.token || req.query.token || req.headers['secure-token'];
      req.body.token = token;
      api.createUser(req.body, res);
    });

    app.delete('/auth/user/delete', function (req, res) {
      var token = req.body.token || req.query.token || req.headers['secure-token'];
      req.query.token = token;
      api.deleteUser(req.query, res);
    });
  }
};