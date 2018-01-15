import mongoose from 'mongoose';

var userTypeSchema = mongoose.Schema({
  type: {
    type: String,
    unique: true
  },
  roles: [{
    type: String
  }]
});

userTypeSchema.methods.getType = function () {
  return this.type;
}

mongoose.model('UserType', userTypeSchema, 'UserTypes');
