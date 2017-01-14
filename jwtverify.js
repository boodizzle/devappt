var jwt = require('jsonwebtoken');
var serverConfig = require('./config/config.js');

// jwt test
// err.message

jwtSecret = serverConfig.jwtSecret
jwt.verify(userToken, jwtSecret, function (err, decoded) {
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