import mongoose from 'mongoose';

var departmentUserSchema = mongoose.Schema({
  type: {
    type: String,
    unique: true
  },
  description: {
    type: String
  }
});

departmentUserSchema.methods.getType = function () {
  return this.type;
}


mongoose.model('DepartmentType', departmentUserSchema, 'DepartmentType');
