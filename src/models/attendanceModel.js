import mongoose from 'mongoose';

var attendanceSchema = new mongo.Schema({
  userid : { type: mongoose.Schema.Types.ObjectId},
  date : { type:mongoose.Schema.Types.Date },
  time: { type:mongoose.Schema.Types.Date , default:Date.now }
})

mongoose.model('Attendance', attendanceSchema, 'Attendance');
