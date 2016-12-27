var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Workout = mongoose.model('Workout');
var WorkedExercise = mongoose.model('WorkedExercise');

router.route('/')
    .get(function(req, res){
        User.findById(req.user._id)
            .populate('workouts')
            .exec(function(err, user){
                if(err) return res.status(500).send(err);
                return res.send(user.workouts);
            });
    })
    .post(function(req, res){
        var workout = new Workout();
        workout.creator = req.user.name;
        workout.routine = req.body.routine;
        workout.worked_exercises = req.body.worked_exercises;

        workout.save(function(err, workout){
            if(err) return res.status(500).send(err);
            User.findById(req.user._id, function(err, user){
                if(err) return res.status(500).send(err);
                user.workouts.push(workout._id);
                user.save(function(err){
                    if(err) return res.status(500).send(err);
                    return res.json(workout);
                });
            });
        });
    });

//Make sure the workout exists, and belongs to the user
function validate(req, res, next){
    Workout.count({_id: req.params.id}, function(err, count){
        if(err) {
            return res.status(500).send(err);
        }
        if(count == 0) {
            return res.send('Workout does not exist');
        }
        if(req.user.workouts.indexOf(req.params.id) == -1){
            return res.send('Not authorized');
        }
        return next();
    });
}

router.use('/:id', validate);

router.route('/:id')
    .get(function(req, res){
        Workout.findById(req.params.id)
            .populate('worked_exercises', 'routine')
            .exec(function(err, workout){
                if(err) return res.status(500).send(err);
                return res.send(workout);
            });
    })
    .put(function(req, res){
        Workout.findById(req.params.id, function(err, workout){
            if(err) return res.status(500).send(err);
            workout = req.body.workout;
            workout.save(function(err, workout){
                if(err) return res.status(500).send(err);
                return res.send(workout);
            });
        });
    })
    .delete(function(req, res){
		//1. delete all related worked_exercises
		//2. delete workout
		//3. delete workout_id from user
        Workout.findById(req.params.id, function(err, workout){
            if(err) return res.status(500).send(err);
            for(var i = 0; i < workout.worked_exercises.length; i++){
                WorkedExercise.remove({_id: workout.worked_exercise[i]}, function(err){
                    if(err) return res.status(500).send(err);
                });
            }
            
            if(res.headersSent) return;

            Workout.remove({_id: req.params.id}, function(err){
                if(err) return res.status(500).send(err);
                User.findById(req.user._id, function(err, user){
                    if(err) return res.status(500).send(err);
                    var index = user.workouts.indexOf(req.params.id);
                    if(index > -1){
                        user.workouts.splice(index, 1);
                    }
                    user.save(function(err){
                        if(err) return res.status(500).send(err);
                        return res.send('Deleted: ' + req.params.id);
                    });
                });
            });
        });
    });


module.exports = router;
