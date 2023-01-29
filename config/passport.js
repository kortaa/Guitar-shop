const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const { body, validationResult } = require('express-validator');

passport.serializeUser(function(user, done){
   done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const messages = [];
        eArray = errors.array();
        eArray.forEach(function (error){
            messages.push(error.msg + ' ' +  error.param);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email}, function (err, user){
        if(err){
            return done(err);
        }
        if(user){
            return done(null, false, {message: 'Email is already in use'});
        }
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result){
            if (err){
                return done(err);
            }
            else{
                return done(null, newUser);
            }
        });
    });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const messages = [];
        eArray = errors.array();
        eArray.forEach(function (error){
            messages.push(error.msg + ' ' +  error.param);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email}, function (err, user){
        if(err){
            return done(err);
        }
        if(!user){
            return done(null, false, {message: 'Wrong email'});
        }
        if(!user.validPassword(password)){
            return done(null, false, {message: 'Wrong password'});
        }

        return done(null, user);

    });
}));