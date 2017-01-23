db = require('../db.js')

module.exports = db.query('select orgID, path from pathing', function (err, result) {
  db.release();
  if (err) {
    console.log(err.message);
  } else {
    console.log(result);
  }
});