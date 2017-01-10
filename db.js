var mysql = require('mysql');
var serverConfig = require('./config/config.js')
function db() {
  this.pool = null;
 
  this.init = function() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: serverConfig.dbHost,
      user: serverConfig.dbUserName,
      password: serverConfig.dbPassword,
      database: serverConfig.dbName
    });
  };
 
  this.acquire = function(callback) {
    this.pool.getConnection(function(err, connection) {
      callback(err, connection);
    });
  };
}
 
module.exports = new db();

// https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens