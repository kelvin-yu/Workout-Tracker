var express = require('express');
var router = express.Router();

function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.send({message: 'not auth'});
    //return res.redirect('/#login');
};

router.use('/', isAuthenticated);

router.route('/')
    .get(function(req, res){
        res.json({xd: req.user});
    });

module.exports = router;