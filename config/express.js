var config = require('./config'),
    express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    session = require('express-session'),
    flash = require('connect-flash'),
    farmer = require('../app/models/farmer.server.model');


module.exports = function () {
    var app = express();


    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());

    //use this code before any route definitions
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: 'OurSuperSecretCookieSecret'
    }));

    app.use(flash());

    app.use('/public', express.static('./public'));
    app.use('/app', express.static('./app'));

    app.use(function (err, req, res, next) {
        res.status(500);
        res.render('error', {
            error: err
        });
    });

    app.set('views', './app/views');
    // app.set('view engine', 'ejs');

    app.get('/api/allfarmer/:item', function (req, res) {
        console.log("in all farmers api call");
        var userInput = req.params.item;

        farmer.find({
            $text: {
                $search: userInput
            }
        }, {
            score: {
                $meta: "textScore"
            },
            "_id": 0,
            "farm_name": 1,
            "stand.location": 1,
            "stand.products": 1
        }).sort({
            score: {
                $meta: "textScore"
            }
        }).exec(function (err, farmer) {
            if (err)
                res.send(err)
            res.json(farmer);
        });
    });

    app.get('/api/allfarmer', function (req, res) {
        console.log("in all farmers api call");

        farmer.find({}, {
            "_id": 1,
            "phone": 1,
            "first_name": 1,
            "last_name": 1,
            "farm_name": 1,
            "address": 1,
            "email": 1,
            "organic": 1,
            "conservative": 1
        }, function (err, farmer) {
            if (err)
                res.send(err)
            console.log(farmer);
            res.json(farmer);
        });
    });

    app.get('/api/organic/:item', function (req, res) {
        console.log("in organic api call");
        var userInput = req.params.item;

        farmer.find({
            "organic": true,
            $text: {
                $search: userInput
            }
        }, {
            score: {
                $meta: "textScore"
            },
            "_id": 0,
            "farm_name": 1,
            "organic ": 1,
            "stand.location": 1,
            "stand.products": 1
        }).sort({
            score: {
                $meta: "textScore"
            }
        }).exec(function (err, farmer) {
            if (err)
                res.send(err)
            res.json(farmer);
        });
    });

    app.get('/api/open/:item', function (req, res) {
        console.log("in open api call");
        var userInput = req.params.item;

        farmer.find({
            "stand.open": true,
            $text: {
                $search: userInput
            }
        }, {
            score: {
                $meta: "textScore"
            },
            "_id": 0,
            "farm_name": 1,
            "open": 1,
            "stand.location": 1,
            "stand.products": 1
        }).sort({
            score: {
                $meta: "textScore"
            }
        }).exec(function (err, farmer) {
            if (err)
                res.send(err)
            res.json(farmer);
        });
    });

    app.post('/api/register', function (req, res) {
        console.log("In api/register");
        var user = new farmer();

        user.first_name = req.body.first_name;
        user.last_name = req.body.last_name;
        user.email = req.body.email;
        user.farm_name = req.body.farmname;

        user.setPassword(req.body.password);
        
        console.log(user.hash, user.salt)

        user.save(function (err, data) {
            if (err)
                console.log(err);
            else
                console.log("Saved ", data);
            var token;
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token": token
            });
        });
    });

    app.post('/api/login', function (req, res) {
        console.log("In api/login");
        var user = farmer()

        user.email = req.body.email;
        user.password - req.body.password;


        passport.authenticate('local', function (err, user, info) {
            var token;
            // If Passport throws/catches an error
            if (err) {
                res.status(404).json(err);
                return;
            }
            // If a user is found
            if (user) {
                token = user.generateJwt();
                res.status(200);
                res.json({
                    "token": token
                });
            } else {
                // If user is not found
                console.log(info);
                console.log(err);
                res.status(401).json(info);
            }
        })(req, res);
    });
    
    //get farmer by id
    app.get('/api/getFarmerById/:id', function(req, res) {
        console.log("in api/getFarmerbyId");
        var user = req.params.id;

        farmer.findOne({
            '_id': user
        }, {
            '_id': 0,
            'first_name': 1,
            'last_name': 1,
            'email': 1,
            'website': 1,
            'farm_name': 1,
            'address': 1,
            'phone': 1,
            'fblink': 1,
            'organic': 1,
            'conservative': 1,
            'stand': 1
        },
        function(err, user) {
            if (err) {
                res.send(err);
            } else {
                res.json(user);
            }
        });
    });

    //update existing stand in farmer document
    app.post('/api/updateStand/:uid/:standId/:updatedData', function(req, res) {
        console.log("in api/updateStand")

        console.log(req.data);


        console.log(req.params);

            var user = req.params.uid,
                stand = req.params.standId,
                updated = req.params.updatedData;

            updated = JSON.parse(updated);

            console.log("user", user);
            console.log("stand", stand);
            console.log("updated", updated);

        farmer.update(
            { 
                '_id': user,
                'stand._id': stand
            },{
                '$set': {
                    "stand.$": updated
                }
            },
            function(err, results) {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    console.log("success", results);
                    res.json(results);
                }
        });      
    });

    app.post('/api/addStand/:uid/:newStand', function(req, res) {
        var user = req.params.uid,
            newStand = req.params.newStand;

        newStand = JSON.parse(newStand);

        farmer.findById(user, function(err, currentFarmer){
            if (err) {
                console.log("findByID", err);
                res.send(err);
            } else {
                console.log(currentFarmer);
                currentFarmer.stand.push(newStand);

                currentFarmer.save(function(err, data){
                    if (err) {
                        console.log("save error", err);
                        res.send(err);
                    } else {
                        res.json(data.stand[data.stand.length-1]);
                    }
                })
            }
        });
    });

    app.post('/api/updateFarmer/:uid/:updatedStand', function(req, res){
        var user = req.params.uid,
            updated = req.params.updatedStand;

        updated = JSON.parse(updated);
        console.log(updated);

        farmer.update(
            { 
                '_id': user
            }, updated,
            function(err, results) {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    console.log("success", results);
                    res.json(results);
                }
        });

    });


    app.delete('/api/deleteStand/:uid/:standId', function(req, res){
        console.log("In deleteStand api");

        var user = req.params.uid,
            stand = req.params.standId;

        farmer.update({
            '_id': user,
        }, {
            "$pull": {"stand" : {
                "_id": stand
            }}
        }, function(err, results) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                console.log("success", results);
                res.json(results);
            }
        })
    });
    
    app.get('/*', function(req, res) {
        res.sendFile('index.html', {root: '.'});
    });

    // require('../app/routes/index.server.routes.js')(app);

    // require('../app/routes/users.server.routes.js')(app);

    return app;
}
