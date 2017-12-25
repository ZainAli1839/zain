
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(cookieParser());

// API file for interacting with MongoDB
const email = require('./routes/email');
const auth = require('./routes/auth');
const index = require('./routes/index');

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Angular DIST output folder
//app.use(express.static(path.join(__dirname, 'public')));

// API location
app.use('/', index);
app.use('/auth', auth);
app.use('/email', email);
app.set("port",process.env.Port||3000);

app.get('/auth/download/:id', (req, res) => {
res.download(path.join(__dirname, "/uploads/"+req.params.id));

});
// Send all other requests to the Angular app

app.use(function(req, res, next) {

  var err = new Error('Not Found');
 
 err.status = 404;

  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
var http = require('http').Server(app);
var port =process.env.Port||3000;

http.listen(port, '0.0.0.0', function(err) {
    console.log('server runninng at ' + http.url );
});