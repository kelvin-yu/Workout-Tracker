var express = require('express');
var router = express.Router();

var routineRoute = require('./api/routine');

function isAuthenticated(req, res, next){
    if(req.isAuthenticated() && req.user){
        return next();
    }
    return res.redirect('/login');
}

router.use('/', isAuthenticated);

router.use('/routine', routineRoute);

module.exports = router;