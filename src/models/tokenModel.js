import mongoose from 'mongoose';
import users from './userModel';
import departmentModel from './departmentModel';
var User = mongoose.model('Users');
var DepartmentType = mongoose.model('DepartmentType');

var tokenSchema = mongoose.Schema({
  tokennumber: {
    type: String
  },
  visitorname:{
    type:String
  },
  phoneno:{
    type:mongoose.Schema.Types.Decimal128
  },
  department:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'DepartmentType'
  },
  description: {
    type: String
  },
  date:{
    type:mongoose.Schema.Types.Date,
    default: Date.now
  },
  wardno:{
    type:Number
  },
  createdby:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Users'
  },
  handledby:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Users'
  },
  handled: {
    type: Boolean
  },
  remarks:{
    type:String
  }

});

tokenSchema.methods.isHandled = function(){
  if(this.handled)
   return this.handled;
   return false;
}



tokenSchema.methods.viewingdepartment = function(callback){
  DepartmentType.find({'type':'viewer'},function(err, department){
    if(err){
      console.log(err);
      return callback(err, null);
    }
    console.log(department[0]._id);
   // department.forEach(function(data, inxe){
    //   console.log(data._id);
    //})
    return callback(null, department[0]._id);
  })
}

tokenSchema.methods.handlingInfo = function(){
  return { handledby: this.handledby, remarks: this.remarks}
}
mongoose.model('Tokens', tokenSchema, 'Tokens');
