var api = require('./models/api');

module.exports = {
  configure: function (app) {

    app.post('/auth', function (req, res) {
      api.authenticate(req.body, res);
    });

    app.get('/auth/resource', function (req, res) {
      api.getResources(req.query, res);
    });

    app.get('/auth/resource/appts', function (req, res) {
      api.getAppts(req.query, res);
    });

    app.get('/auth/user', function (req, res) {
      api.getUsers(req.query, res);
    });

    app.put('/auth/user/email', function (req, res) {
      api.updateEmail(req.body, res);
    });

    app.post('/auth/user/create', function (req, res) {
      api.createUser(req.body, res);
    });

    app.delete('/auth/user/delete', function (req, res) {
      api.deleteUser(req.query, res);
    });
  }
};  