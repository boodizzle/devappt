var express = require('express');
var bodyparser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var morgan = require('morgan');
var cors = require('cors');


// use morgan to log requests to the console
app.use(cors()); 


app.use(morgan('dev'));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
var db = require('./db');
var routes = require('./routes');

// set interval placeholder
// setInterval(function () {
//   console.log('Interval (10 seconds!)');
// }, 10000);

db.init();
routes.configure(app);
var server = app.listen(PORT, function () {
  console.log('Server listening on port ' + PORT);
});
