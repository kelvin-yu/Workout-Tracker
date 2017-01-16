var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(passport){

    router.get('/success', function(req, res){
        res.send({state: 'success', user: req.user ? req.user : null});
    });

    router.get('/failure', function(req, res){
        res.send({state: 'failure', user: null, message: req.flash('authMessage')});
    });

    router.post('/login', passport.authenticate('login', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure',
        failureFlash : true
    }));

    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure',
        failureFlash : true
    }));

    router.get('/logout', function(req, res){
        req.logout();
		res.send("logged out");
    });

	router.get('/loggedin', function (req, res){
		res.send(req.isAuthenticated() ? true : false);	
	});
    return router;
};
