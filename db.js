var mysql = require('mysql');
 
function db() {
  this.pool = null;
 
  this.init = function() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'apptest'
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