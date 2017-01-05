var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function() {
    var db = mongoose.connect(process.env.MONGOLAB_URI);
    mongoose.Promise = global.Promise;
    var conn = mongoose.connection;
    conn.on('error', console.error.bind(console, 'connection error'));
    conn.on('connected', function(){
    	console.log('Mongoose connection open to ', process.env.MONGOLAB_URI);
    });
    console.log(db);
    return db;
};