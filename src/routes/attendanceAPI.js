import {router} from './index';
import attendanceModel from '../models/attendanceModel';
import mongoose from 'mongoose';
var Attendance = mongoose.model('Attendance');
var User = mongoose.model('Users');

router.post('/attendance/attend', function(req, res){
 if(!req.body.userid && !req.body.date && !req.body.time){
   return res.status(403).send({
     message:'Please fill all the fields'
   })
 }
 var userid = req.sanitize(req.body.userid);
 var date = req.sanitize(req.body.date);
 var time = req.sanitize(req.body.time);
 var attendance = new Attendance();
 attendance.userid = userid;
 attendance.projdate = date;
 //attendance.time = time;
 attendance.save().then(function(data){
   data.populate('userid', function(err, user){
    if(err){
      return res.status(500).json("Error while making attendance "+ err.message);
    }
     var userid = user.userid;
    res.status(200).json({id: userid._id, firstname: userid.firstname, lastname: userid.lastname, wardno: userid.wardno, employeeid: userid.employeeid, image: userid.image});
   })

 }).catch(function(err){
   console.log(err.message);
   res.status(500).json({message:'Error while making attendance ' +err.message});
 })

});

router.param('userid', function(req,res,next, id){
  var query = User.findById(id);
  query.exec(function(err, user){
    if(err){
      return next(err);
    }
    if(!user){
      return next(new Error("Cannot find the user"));
    }
    req.user = user;
    return next();
  })
})
router.get('/attendance/:userid', function(req, res){
  var user = req.user;
  Attendance.find({'userid': user._id}).exec(function(err, attend){
    if(err){

      return res.send(500).json({message:'Error while fetcing attendance'});
    }
    if(!attend){
      return res.send(404).json({message:'Attendance not found'});
    }
    attend = attend.map(function(data, index){
      return {username:user.username, date:data.projdate, time:data.time};
    })

    return res.status(200).json(attend);
  })
});
