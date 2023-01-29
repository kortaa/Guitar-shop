var express = require('express');
var router = express.Router();
const csrf = require('csurf');
const passport = require('passport');
const { body, validationResult } = require('express-validator');


const csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn ,function(req, res, next){
    res.render('user/profile');
});

router.get('/logout', isLoggedIn ,function(req, res, next){
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

router.use('/', notLoggedIn, function(req, res, next) {
    next();
});

router.get('/signup', function (req, res, next){
    const messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', [body('email').isEmail(),
    body('password').isLength({min: 5})], passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}));

router.get('/signin', function (req, res, next){
    const messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', [body('email').isEmail(),
    body('password').isLength({min: 5})], passport.authenticate('local.signin', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
}));



module.exports = router;

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/')
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}