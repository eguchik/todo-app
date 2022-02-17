var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// github webhook server
const exec = require('child_process').exec;

const webhook_app = express()
webhook_app.set('views', path.join(__dirname, 'views'));
webhook_app.set('view engine', 'jade');

webhook_app.use(logger('dev'));
webhook_app.use(express.json());
webhook_app.use(express.urlencoded({ extended: false }));
webhook_app.use(cookieParser());
webhook_app.use(express.static(path.join(__dirname, 'public')));

webhook_app.post('/webhook', (req, res) => {
  var crypto = require('crypto')
  var
    hmac,
    calculatedSignature,
    payload = req.body;

  hmac = crypto.createHmac('sha256', process.env.SECRET);
  hmac.update(JSON.stringify(payload));
  calculatedSignature = 'sha256=' + hmac.digest('hex');

  if (req.headers['X-Hub-Signature-256'] === calculatedSignature) {
    exec('sudo git pull');
  } else {
    console.log(req.headers['X-Hub-Signature-256']);
    console.log(calculatedSignature);
  }

  res.sendStatus(200);
})

webhook_app.get('/webhook', (req, res) => {
  res.send('test')
})

webhook_app.listen(9000, () => {
  console.log(`Example app listening on port 9000`)
})


module.exports = app;
