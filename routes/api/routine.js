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
                if(err) return res.send(500, err);
                return res.send(200, user.routines);
            });
    })
    .post(function(req, res){
        var routine = new Routine();
        routine.creator = req.user.name;
        routine.title = req.body.title;
        routine.exercises = req.body.exercises;

        routine.save(function(err, routine){
            if(err) return res.send(500, err);
            User.findById(req.user._id, function(err, user){
                if(err) return res.send(err);
                user.routines.push(routine._id);
                user.save(function(err){
                    if(err) return res.send(500, err);
                    return res.json(routine);
                });
            });
        });
    });

//Make sure the routine exists, and belongs to the user
function validate(req, res, next){
    Routine.count({_id: req.params.id}, function(err, count){
        if(err) {
            return res.send(500, err);
        }
        if(count == 0) {
            return res.send(200, 'Routine does not exist');
        }
        if(req.user.routines.indexOf(req.params.id) == -1){
            return res.send(200, 'Not authorized');
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
                if(err) return res.send(500, err);
                return res.send(200, routine);
            });
    })
    .put(function(req, res){
        Routine.findById(req.params.id, function(err, routine){
            if(err) return res.send(500, err);
            routine = req.body.routine;
            routine.save(function(err, routine){
                if(err) return res.send(500, err);
                return res.send(200, routine);
            });
        });
    })
    .delete(function(req, res){
        Routine.remove({_id: req.params.id}, function(err){
            if(err) return res.send(500, err);
            User.findById(req.user._id, function(err, user){
                if(err) return req.send(500, err);
                var index = user.routines.indexOf(req.params.id);
                if(index > -1){
                    user.routines.splice(index, 1);
                }
                user.save(function(err){
                    if(err) return res.send(500, err);
                    return res.send(200, 'Deleted: ' + req.params.id);
                });
            });
        });
    });


module.exports = router;