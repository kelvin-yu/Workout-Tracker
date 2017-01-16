var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

function validate(req, res, next){
	if(req.user._id != req.params.id)
		return res.status(403).send('Not authorized');
	return next();
}

router.get('/', function(req, res){
	User.findById(req.user._id, function(err, user){
		if(err) return res.status(500).send(err);
		console.log(user);
		res.json(user);
	});	
});

router.use('/:id', validate);

router.get('/:id', function(req, res){
	User.findById(req.params.id, function(err, user){
		if(err) return res.status(500).send(err);
		console.log(user);
		res.json(user);
	});	
});



module.exports = router;
