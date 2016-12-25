var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Exercise = mongoose.model('Exercise');

router.route('/')
    .get(function(req, res){
        User.findById(req.user._id)
            .populate('exercises')
            .exec(function(err, user){
                if(err) return res.status(500).send(err);
                return res.send(user.exercises);
            });
    })
    .post(function(req, res){
        var exercise = new Exercise();
        exercise.name = req.body.name;
        exercise.muscles_worked = req.body.muscles_worked;
        exercise.force = req.body.force;
        exercise.equipment = req.body.equipment;

        exercise.save(function(err, exercise){
            if(err) return res.status(500).send(err);
            User.findById(req.user._id, function(err, user){
                if(err) return res.status(500).send(err);
                user.exercises.push(exercise._id);
                user.save(function(err){
                    if(err) res.status(500).send(err);
                    return res.json(exercise);
                });
            });
        });
    });

//Make sure the exercise exists, and belongs to the user
function validate(req, res, next){
    Exercise.count({_id: req.params.id}, function(err, count){
        if(err) {
            return res.status(500).send(err);
        }
        if(count == 0) {
            return res.send('Exercise does not exist');
        }
        if(req.user.exercises.indexOf(req.params.id) == -1){
            return res.send('Not authorized');
        }
        return next();
    });
}

router.use('/:id', validate);

router.route('/:id')
    .get(function(req, res){
        Exercise.findById(req.params.id, function(err, exercise) {
            if (err) return res.status(500).send(err);
            return res.send(exercise);
        })
    })
    .put(function(req, res){
        Exercise.findById(req.params.id, function(err, exercise){
            if(err) return res.status(500).send(err);
            exercise = req.body.exercise;
            exercise.save(function(err, exercise){
                if(err) return res.status(500).send(err);
                return res.send(exercise);
            });
        });
    })
    .delete(function(req, res){
        Exercise.remove({_id: req.params.id}, function(err){
            if(err) return res.status(500).send(err);
            User.findById(req.user._id, function(err, user){
                if(err) return res.status(500).send(err);
                var index = user.exercises.indexOf(req.params.id);
                if(index > -1){
                    user.exercises.splice(index, 1);
                }
                user.save(function(err){
                    if(err) res.status(500).send(err);
                    return res.send('Deleted: ' + req.params.id);
                });
            });
        });
    });


module.exports = router;