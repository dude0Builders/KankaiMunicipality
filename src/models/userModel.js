var mongoose = require('mongoose');
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { SchemaType } from 'mongoose';

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true
  },
  hash: String,
  salt: String,
  type: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserType'
  }],
  firstname:String,
  lastname:String,
  employeeid:String,
  wardno:Number,
  phoneno:mongoose.Schema.Types.Decimal128,
  email:String,
  address:String,
  image:String,
});



userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
}

userSchema.methods.validatePassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');

  return this.hash === hash;
}

userSchema.methods.generateJWT = function () {
  var today = new Date();
  var exp = new Date(today);
  exp.setHours(exp.getHours() + 1);

  console.log(jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000)
  }, 'SECRET'))
  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000)
  }, 'SECRET');

}

mongoose.model('Users', userSchema, 'Users');
