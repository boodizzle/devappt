var db = require('../db');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var serverConfig = require('../config/config.js');
var jwtSecret = serverConfig.jwtSecret;

function Appts() {

  this.authenticate = function (req, res) {
    db.acquire(function (err, con) {
      con.query('select orgID,userid,userName,password from users where userName = ?', [req.username], function (err, result) {
        con.release();
        var hashPSW = result[0].password;
        var userN = result[0].userName;
        var orgID = result[0].orgID;
        var userID = result[0].userid
        if (err) {
          res.status(500).send('Error: ' + err.code);
          console.log(err.code);
        }
        // compare Hash Salt
        bcrypt.compare(req.password, hashPSW, function (err, authres) {
          if (authres) {
            console.log('Authenticated!');

            var jwtoken = jwt.sign({ org_id: orgID, user_name: userN, user_id: userID }, serverConfig.jwtSecret, {
              expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).json({ "message": "Authenticated! Enjoy your token!", "token": jwtoken })
            console.log(serverConfig.jwtSecret);

          } else {
            console.log('no bueno!');
            res.status(500).send('invalid username or password!');
          }
        });
      });
    });
  };


  this.getAppts = function (req, res) {
    var decoded = jwt.verify(req.userToken, jwtSecret, function (err, decoded) {
      if (err) {
        res.status(500).json({ error: err.name, desc: err.message });
        console.log({ error: err.name, desc: err.message });
      } else if (!decoded) {
        res.redirect('/auth');
      }
      if (decoded) {
        if (req.hasOwnProperty('res_id') && req.res_id.length > 0 && isFinite(req.res_id)) {
          db.acquire(function (err, con) {
            con.query('select * from appts where resource_id = (select emrID from resources where resID = ? and orgID = ? and active = 1) and orgID = ? begintime', [req.res_id, decoded.org_id, decoded.org_id], function (err, result) {
              con.release();
              if (err) res.status(500).send(err.code);
              res.status(200).json(result);
            });
          });
        } else {
          res.status(500).send({ error: 'invalid entry!' });
        }
      }
    });
  };

  this.getResources = function (req, res) {
    var decoded = jwt.verify(req.userToken, jwtSecret, function (err, decoded) {
      if (err) {
        res.status(500).json({ error: err.name, desc: err.message });
        console.log({ error: err.name, desc: err.message });
      } else if (!decoded) {
        res.redirect('/auth');
      }
      if (decoded) {
        db.acquire(function (err, con) {
          con.query('select resID, orgID, description, firstName, lastName, active from resources where orgID = ? order by lastName', [decoded.org_id], function (err, result) {
            con.release();
            if (err) res.status(500).send(err.code);
            res.status(200).json(result);
          });
        });
      } else {
        res.status(500).send({ error: 'invalid entry!' });
      }
    });
  }

  this.getUsers = function (req, res) {
    var decoded = jwt.verify(req.userToken, jwtSecret, function (err, decoded) {
      if (err) {
        res.status(500).json({ error: err.name, desc: err.message });
        console.log({ error: err.name, desc: err.message });
      } else if (!decoded) {
        res.redirect('/auth');
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
        res.status(500).send({ error: 'invalid entry!' });
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

  this.updateEmail = function (qParam, res) {
    jwt.verify(qParam.userToken, jwtSecret, function (err, decoded) {
      if (err) {
        res.status(500).json({ error: err.name, desc: err.message });
        console.log({ error: err.name, desc: err.message });
        if (!decoded) {
          res.redirect('/auth');
        }
        if (decoded) {
          db.acquire(function (err, con) {
            con.query('update users set email = ?, modified = NOW() where userid = ?', [qParam.newEmail, decoded.user_id], function (err, result) {
              con.release();
              if (err) {
                res.send({ status: 1, message: err.code });
              } else {
                res.send({ status: 0, message: 'Email updated!' });
              }
            });
          });
        };
      }
    });
  };

  this.deleteUser = function (req, res) {
    jwt.verify(qParam.userToken, jwtSecret, function (err, decoded) {
      if (err) {
        res.status(500).json({ error: err.name, desc: err.message });
        console.log({ error: err.name, desc: err.message });
        if (!decoded) {
          res.redirect('/auth');
        }
        if (decoded) {
          db.acquire(function (err, con) {
            con.query('delete from users where orgID = ? AND userid = ?', [decoded.org_id, req.userid], function (err, result) {
              con.release();
              if (err) {
                res.send({ status: 1, message: err.code });
              } else {
                res.send({ status: 0, message: 'Deletion successful' });
              }
            });
          });
        };
      }
    });
  }
}
module.exports = new Appts();