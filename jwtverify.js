var jwt = require('jsonwebtoken');
var serverConfig = require('./config/config.js');

// jwt test
// err.message

jwtSecret = serverConfig.jwtSecret
var decoded = jwt.verify(userToken, jwtSecret, function(err, decoded) {
if(err) {
res.status(500).json({error: err.name, desc: err.message});
console.log({error: err.name, desc: err.message});
} else {
console.log(decoded.org_id);
}});
// serverConfig.jwtSecret


tokens:
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdfaWQiOjMsInVzZXJfbmFtZSI6ImpobyIsInVzZXJfaWQiOjQxLCJpYXQiOjE0ODQwNjc3NzEsImV4cCI6MTQ4NDE1NDE3MX0.BnnWsgxs-Flz3SZMnhwkn65Qn_95UA87EbrexAJUpGk
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdfaWQiOjMsInVzZXJfbmFtZSI6ImpobyIsInVzZXJfaWQiOjQxLCJpYXQiOjE0ODQwNjg5MDEsImV4cCI6MTQ4NDE1NTMwMX0.XFMUfGJjWKeJ6AtVvmcZwIo4pKBWVGEQt5rNyyj5EzQ
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdfaWQiOjMsInVzZXJfbmFtZSI6ImpobyIsInVzZXJfaWQiOjQxLCJpYXQiOjE0ODQwNjg5MDksImV4cCI6MTQ4NDE1NTMwOX0.iDfGbR66hi50uqtF0EVRSDsU2fRtSk3Ic5naSWxMGCI