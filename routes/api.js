var express = require('express');
var router = express.Router();

var routineRoute = require('./api/routine');
var exerciseRoute = require('./api/exercise');

function isAuthenticated(req, res, next){
    if(req.isAuthenticated() && req.user){
        return next();
    }
    return res.redirect('/login');
}

router.use('/', isAuthenticated);

router.use('/routine', routineRoute);
router.use('/exercise', exerciseRoute);

module.exports = router;