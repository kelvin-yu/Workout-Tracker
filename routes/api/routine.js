var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Routine = mongoose.model('Routine');

router.route('/')
    .get(function(req, res){
        User.findById(req.user._id)
            .populate('routines')
            .exec(function(err, user){
                if(err) return res.status(500).send(err);
                return res.send(user.routines);
            });
    })
    .post(function(req, res){
		console.log(req.body);
        var routine = new Routine();
        routine.creator = req.user.name;
        routine.title = req.body.title;
        routine.exercises = req.body.exercises;
		console.log('made it' + routine);
        routine.save(function(err, routine){
			console.log(err);
            if(err) return res.status(500).send(err);
            User.findById(req.user._id, function(err, user){
                if(err) return res.status(500).send(err);
                user.routines.push(routine._id);
                user.save(function(err){
                    if(err) return res.status(500).send(err);
                    return res.json(routine);
                });
            });
        });
    });

//Make sure the routine exists, and belongs to the user
function validate(req, res, next){
    Routine.count({_id: req.params.id}, function(err, count){
        if(err) {
            return res.status(500).send(err);
        }
        if(count == 0) {
            return res.send('Routine does not exist');
        }
        if(req.user.routines.indexOf(req.params.id) == -1){
            return res.send('Not authorized');
        }
        return next();
    });
}

router.use('/:id', validate);

router.route('/:id')
    .get(function(req, res){
        Routine.findById(req.params.id)
            .populate('exercises')
            .exec(function(err, routine){
                if(err) return res.status(500).send(err);
                return res.send(routine);
            });
    })
    .put(function(req, res){
        Routine.findById(req.params.id, function(err, routine){
            if(err) return res.status(500).send(err);
            routine = req.body.routine;
            routine.save(function(err, routine){
                if(err) return res.status(500).send(err);
                return res.send(routine);
            });
        });
    })
    .delete(function(req, res){
        Routine.remove({_id: req.params.id}, function(err){
            if(err) return res.status(500).send(err);
            User.findById(req.user._id, function(err, user){
                if(err) return res.status(500).send(err);
                var index = user.routines.indexOf(req.params.id);
                if(index > -1){
                    user.routines.splice(index, 1);
                }
                user.save(function(err){
                    if(err) return res.status(500).send(err);
                    return res.send('Deleted: ' + req.params.id);
                });
            });
        });
    });


module.exports = router;
