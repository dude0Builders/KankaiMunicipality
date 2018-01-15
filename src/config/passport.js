import passport from 'passport';
import mongoose from 'mongoose';
import localStrategy from 'passport-local';
import '../models/userModel';
var User = mongoose.model('Users');

passport.use(new localStrategy.Strategy(function(username, password, done){
  User.findOne({username:username}, function(err, user){
    if(err) return done(err);
    if(!user){
      return done(null, false, {'message':'Incorrect Username.'});
    }
    if(!user.validatePassword(password)){
      return done(null, false, {'message':'Incorrect Password.' });
    }

    return done(null, user);
  })
}
))


