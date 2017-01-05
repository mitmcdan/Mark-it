process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/config'),
    mongoose = require('./config/mongoose'),
    express = require('./config/express'),
    path = require('path'),
    passport = require('./config/passport'),
    db = mongoose(),
    farmer = require('./app/models/farmer.server.model'),
    app = express();

app.listen(config.port);

module.exports = app;

console.log(process.env.NODE_ENV + ' server running at http://localhost:' + config.port);