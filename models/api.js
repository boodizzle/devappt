var db = require('../db');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
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
  }


  this.getAppts = function (qParams, res) {
    var decoded = jwt.verify(qParams.userToken, jwtSecret, function (err, decoded) {
      if (err) {
        res.status(500).json({ error: err.name, desc: err.message });
        console.log({ error: err.name, desc: err.message });
        if (!decoded) {
          res.status(500).json({ error: err.name, desc: err.message });
        }
        if (decoded) {
          if (qParams.hasOwnProperty('provid') && qParams.hasOwnProperty('orgid') && qParams.provid.length > 0 && qParams.orgid.length > 0 && isFinite(qParams.provid) && isFinite(qParams.orgid)) {
            db.acquire(function (err, con) {
              con.query('select * from appts where provID = ? and orgID = ? order by date, beginTime', [qParams.provid, qParams.orgid], function (err, result) {
                con.release();
                if (err) res.status(500).send(err.code);
                res.status(200).json(result);
              });
            });
          } else {
            res.status(500).send('invalid entry!');
          }
        }
      }
    });
  };


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
          res.status(500).json({ error: err.name, desc: err.message });
        }
        if (decoded) {
          // continue onto query
          db.acquire(function (err, con) {
            con.query('update users set email = ? where userid = ?', [qParam.newEmail, qParam.userid], function (err, result) {
              con.release();
              if (err) {
                res.send({ status: 1, message: err.code });
              } else {
                res.send({ status: 0, message: 'Email updated!' });
              }
            });
          });
          //  end the next
        }
      }
    });
  };

  this.deleteUser = function (req, res) {
    db.acquire(function (err, con) {
      con.query('delete from users where orgID = ? AND userid = ?', [req.orgid, req.userid], function (err, result) {
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
module.exports = new Appts();