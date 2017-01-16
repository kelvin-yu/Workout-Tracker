var express = require('express');
var router = express.Router();

var routineRoute = require('./api/routine');
var exerciseRoute = require('./api/exercise');
var workoutRoute = require('./api/workout');
var userRoute = require('./api/user');

function isAuthenticated(req, res, next){
    if(req.isAuthenticated() && req.user){
        return next();
    }
    return res.status(401).send("not authenticated");
}

router.use('/', isAuthenticated);

router.use('/routine', routineRoute);
router.use('/exercise', exerciseRoute);
router.use('/workout', workoutRoute);
router.use('/user', userRoute);

module.exports = router;


