var db = require('../db');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var serverConfig = require('../config/config.js');
var jwtSecret = serverConfig.jwtSecret;

function Appts() {

  this.authenticate = function (req, res) {

    db.acquire(function (err, con) {
      con.query('select orgID,userid,userName,password from users where userName = ?', [req.user], function (err, result) {
        con.release();

        if (result.length <= 0) {
         return res.status(500).json({
            "message": "Invalid UserName!"
          })
        } else if (err) {
        return res.status(500).send('Error: ' + err.code);
        } else {

          var hashPSW = result[0].password;
          var userN = result[0].userName;
          var orgID = result[0].orgID;
          var userID = result[0].userid

          // compare Hash Salt
          bcrypt.compare(req.password, hashPSW, function (err, authres) {
            if (authres) {
              console.log('Authenticated!');

              var jwtoken = jwt.sign({
                org_id: orgID,
                user_name: userN,
                user_id: userID
              }, serverConfig.jwtSecret, {
                  expiresIn: 86400 // expires in 24 hours
                });
             return res.status(200).json({
                "message": "Authenticated! Enjoy your token!",
                "token": jwtoken
              })

            } else {
            return res.status(500).send('invalid username or password!');
            }
          });
        }
      });
    });
  };


  this.getAppts = function (req, res) {
    var token = req.token;
    var decoded = jwt.verify(token, jwtSecret, function (err, decoded) {
      if (err || !decoded) {
        res.send({
          error: err.name,
          desc: err.message,
          command: 1984
        });
      }
      if (decoded) {
        if (req.hasOwnProperty('res_id') && req.res_id.length < 10 && isFinite(req.res_id)) {
          db.acquire(function (err, con) {
            con.query('select a.extID,a.patLast,a.patFirst,a.event,a.details,DATE_FORMAT(a.appt_date, "%m-%d-%Y")as appt_date,a.begintime,a.endtime,a.duration,a.confirm_ind,a.appt_kept_ind,a.cancel_ind,a.rendering,a.Resource,a.location from appts a inner join orgs on a.orgID = orgs.orgID inner join resources on a.resource_Id = resources.emrID where resources.resID = ? and a.orgID = ? and a.appt_date = ? and orgs.active=1 order by begintime', [req.res_id, decoded.org_id, req.appt_date], function (err, result) {
              con.release();
              if (err) res.send({
                cause: 'SQL',
                error: err,
                err_desc: err.code,
                command: 1984
              });
              res.status(200).json(result);
            });
          });
        } else {
          res.status(500).send({
            error: 'invalid entry!'
          });
        }
      }
    });
  };

  this.getSingleAppt = function (req, res) {
    var token = req.token;
    var decoded = jwt.verify(token, jwtSecret, function (err, decoded) {
      if (err || !decoded) {
        res.send({
          error: err.name,
          desc: err.message,
          command: 1984
        });
      }
      if (decoded) {
        if (req.hasOwnProperty('appt_id')) {
          db.acquire(function (err, con) {
            con.query('select a.patLast,a.patFirst,a.event,a.details,DATE_FORMAT(a.appt_date, "%m-%d-%Y")as appt_date,a.begintime,a.endtime,a.duration,a.confirm_ind,a.appt_kept_ind,a.cancel_ind,a.resource,a.rendering,a.appt_status,a.location,a.appt_type from appts a inner join orgs on a.orgID = orgs.orgID where a.extID = ? and a.orgID = ? and orgs.active = 1', [req.appt_id, decoded.org_id], function (err, result) {
              con.release();
              if (err) res.send({
                cause: 'SQL',
                error: err,
                err_desc: err.code,
                command: 1984
              });
              res.status(200).json(result);
            });
          });
        } else {
          res.status(500).send({
            error: 'invalid entry!'
          });
        }
      }
    });
  };

  this.getResources = function (req, res) {
    var token = req.token;
    var decoded = jwt.verify(token, jwtSecret, function (err, decoded) {
      if (err || !decoded) {
        res.send({
          error: err.name,
          desc: err.message,
          command: 1984
        });
      }
      if (decoded) {
        db.acquire(function (err, con) {
          con.query('select resID,description,emrID,orgID, description, firstName, lastName, active from resources where orgID = ? order by lastName', [decoded.org_id], function (err, result) {
            con.release();
            if (err) return res.send({
              cause: 'SQL',
              error: err,
              err_desc: err.code,
              command: 1984
            });
           return res.status(200).json(result);

          });
        });
      }
    });
  }

  this.getUsers = function (req, res) {
    var token = req.token;
    var decoded = jwt.verify(token, jwtSecret, function (err, decoded) {
      if (err || !decoded) {
        res.send({
          error: err.name,
          desc: err.message,
          command: 1984
        });
      }
      if (decoded) {
        db.acquire(function (err, con) {
          con.query('select userID,orgID,userName,email,active from users where orgID = ? order by userName', [decoded.org_id], function (err, result) {
            con.release();
            if (err) res.status(500).send(err.code);
            res.status(200).json(result);
          });
        });
      } else {
        res.status(500).send({
          error: 'invalid entry!'
        });
      }
    });
  }

  this.createUser = function (req, res) {
    var orgID = req.orgid;
    var uName = req.username;
    var textPSW = req.password;
    var fName = req.fname;
    var lName = req.lname;
    var email = req.email;
    // Crypto Hash+Salt
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(textPSW, salt, function (err, hash) {
        // store hash in db
        db.acquire(function (err, con) {
          con.query('insert into users (orgID,userName,password,firstName,lastName,email) values(?,?,?,?,?,?)', [orgID, uName, hash, fName, lName, email], function (err, results) {
            con.release();
            if (err && err.code === 'ER_DUP_ENTRY') {
              res.status(500).send(err.code);
            } else if (err && err.code !== 'ER_DUP_ENTRY') {
              res.status(500).send(err.code);
            } else {
              res.status(200).send('Success! user has been created!');
            }
          });
        });
      });
    });
  };

  this.updateEmail = function (req, res) {
    var token = req.token;

    jwt.verify(token, jwtSecret, function (err, decoded) {
      if (err || !decoded) {
        res.send({
          error: err.name,
          desc: err.message,
          command: 1984
        });
      }
      if (decoded) {
        db.acquire(function (err, con) {
          con.query('update users set email = ?, modified = NOW() where userid = ?', [req.newEmail, decoded.user_id], function (err, result) {
            con.release();
            if (err) {
              res.send({
                status: 1,
                message: err.code
              });
            } else {
              res.send({
                status: 0,
                message: 'Email updated!'
              });
            }
          });
        });
      };
    });
  };

  this.deleteUser = function (req, res) {
    var token = req.token;
    jwt.verify(token, jwtSecret, function (err, decoded) {
      if (err || !decoded) {
        res.send({
          error: err.name,
          desc: err.message,
          command: 1984
        });
      }
        if (decoded) {
          db.acquire(function (err, con) {
            con.query('delete from users where orgID = ? AND userid = ?', [decoded.org_id, req.userid], function (err, result) {
              con.release();
              if (err) {
                res.send({
                  status: 1,
                  message: err.code
                });
              } else {
                res.send({
                  status: 0,
                  message: 'Deletion successful'
                });
              }
            });
          });
        };
    });
  }
}
module.exports = new Appts();