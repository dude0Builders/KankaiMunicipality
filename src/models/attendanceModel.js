import mongoose from 'mongoose';

var attendanceSchema = new mongoose.Schema({
  userid : { type: mongoose.Schema.Types.ObjectId, ref:'Users'},
  sysdate : { type:mongoose.Schema.Types.Date, default:Date.now},
  projdate: { type:mongoose.Schema.Types.Date , default:Date.now },
  time: {type:mongoose.Schema.Types.Date , default: function(){return new Date().getTime()}}

})

mongoose.model('Attendance', attendanceSchema, 'Attendance');
