var api = require('./models/api');

module.exports = {
  configure: function (app) {

    app.post('/auth', function (req, res) {
      api.authenticate(req.body, res);
    });

    app.get('/auth/resource', function (req, res) {
      api.getRes(req.query, res);
    });

    app.get('/auth/resource/appts', function (req, res) {
      api.getAppts(req.query, res);
    });

    app.put('/auth/user/email', function (req, res) {
      api.updateEmail(req.body, res);
    });

    app.post('/auth/user/new', function (req, res) {
      api.createUser(req.body, res);
    });

    app.delete('/auth/user/delete', function (req, res) {
      api.deleteUser(req.query, res);
    });
  }
};  