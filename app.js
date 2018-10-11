// Load the dotfiles.
require('dotenv').load({
  silent: true
});

var express = require('express');

// Middleware!
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');

var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
var database = process.env.DATABASE || process.env.MONGODB_URI || "mongodb://localhost:27017";

var settingsConfig = require('./config/settings');
var adminConfig = require('./config/admin');

var app = express();

// include and initialize the rollbar library
var Rollbar = require("rollbar");
var rollbar = new Rollbar({
  accessToken: '102baf521af6406e818e792790758235',
  captureUncaught: true,
  captureUnhandledRejections: true
});

function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "dev") {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}

app.use(requireHTTPS);

// Connect to mongodb
mongoose.connect(database);

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(methodOverride());

app.use(express.static(__dirname + '/app/client'));

// Routers =====================================================================

var apiRouter = express.Router();
require('./app/server/routes/api')(apiRouter);
app.use('/api', apiRouter);

var authRouter = express.Router();
require('./app/server/routes/auth')(authRouter);
app.use('/auth', authRouter);

require('./app/server/routes')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);