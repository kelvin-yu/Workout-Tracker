var mongoose = require('mongoose');
var User = mongoose.model('User');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport){

    passport.serializeUser(function(user, done){
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });

    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done){
            User.findOne({'username': username}, function(err, user){

                if(err) return done(err);

                if(!user){
                    return done(null, false, req.flash('authMessage', 'Invalid username or password'));
                }

                user.verifyPassword(password, function(err, isMatch){
                    if(err) return done(err);

                    if(!isMatch) return done(null, false, req.flash('authMessage', 'Invalid username or password'));

                    return done(null, user);
                });
            });
        }
    ));

    passport.use('signup', new LocalStrategy({
            passReqToCallback : true //allows req parameter in callback
        },
        function(req, username, password, done){

            User.findOne({'username' : username}, function(err, user){
                if(err) return done(err);

                if(user) return done(null, false, req.flash('authMessage', 'User already exists'));
                else{
                    var newUser = new User();

                    newUser.username = username;
                    newUser.password = password;
                    newUser.name = req.body.name;

                    newUser.save(function(err){
                        if(err) return done(err);
                        return done(null, newUser);
                    });
                }
            });
        })
    );
};
