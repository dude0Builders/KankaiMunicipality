import {router,auth} from "./index";
import user from '../models/userModel';
import userType from '../models/userTypeModel';
import mongoose from 'mongoose';
import passport from 'passport';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import shortid from 'shortid';

var User = mongoose.model('Users');
var UserType = mongoose.model('UserType');

router.get('/user/list', auth, function (req, res, next) {
  User.find(function (err, users) {
    if (err)
      res.status(500).json({
        message: 'Error while fetching users list'
      })
      var result=[];
      users.forEach(function(data, index){
        console.log(index +", "+ data);
        result.push({'username':data.username, 'id':data._id});
      })
    res.send(result);
  });
});

router.post('/register',  function (req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      message: "Please fill all the fields."
    });
  }
  var user = new User();
  user.username = req.sanitize(req.body.username);
  user.setPassword(req.sanitize(req.body.password));
  user.firstname = req.sanitize(req.body.firstname);
  user.lastname = req.sanitize(req.body.lastname);
  user.phoneno = req.sanitize(req.body.phoneno);
  user.email = req.sanitize(req.body.email);
  user.wardno = req.sanitize(req.body.wardno);
  user.employeeid = req.sanitize(req.body.employeeid);
  user.address = req.sanitize(req.body.address);
  user.image = req.sanitize(req.body.image);
  var promise = user.save();
  promise.then(function (data) {
    res.json({
      token: user.generateJWT(),
      id:data._id
    });
  }).catch(function (err) {
    return res.status(500).json(err.message);
  })
});

router.param('userid', function (req, res, next, id) {
  var query = User.findById(id);
  query.exec(function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user)
      return next(new Error('Cannot find the User'));
    req.user = user;
    return next();
  })
})

router.put('/user/:userid', auth, function (req, res, next) {
  var user = req.user;
  user.setPassword(req.sanitize(req.body.password));
  user.save(function (err) {
    if (err) {
      return next(err);
    }
    return res.json('User successfully updated!');
  })
});


router.post('/login', function (req, res, next) {
  if (!req.body.username && !req.body.password) {
    return res.status(403).send({
      'message': 'Please fill all the fields.'
    })
  }
  var username = req.sanitize(req.body.username);
  var password = req.sanitize(req.body.password);
  passport.authenticate('local', function (err, user, info) {
    if (err) return next(err);
    if (user) {
      return res.json({
        token: user.generateJWT()
      });
    } else {
      return res.status(401).json(info);
    }

  })(req, res, next);
})

router.delete('/user/:userid', auth, function (req, res, next) {

  res.end();
});


router.post('/usertype/create', auth, function (req, res, next) {
  var userType = new UserType();
  var type = req.sanitize(req.body.type);
  var roles = req.sanitize(req.body.roles);
  if (!type || !(req.body.roles instanceof Array)) {
    console.log(roles);
    return res.status(403).send({
      message: 'Invalid Input'
    });
  }

  userType.type = type;
  userType.roles = req.body.roles;
  /*req.body.roles.forEach(function(data){
    userType.roles.push(data);
  });*/
  var promise = userType.save();
  promise.then(function (data) {
    console.log('UserType added ' + type);
    return res.status(200).json({
      message: 'UserType added Successfully.'
    })
  }).catch(function (error) {
    console.error('Error occurred while adding userType');
    return res.status(500).json({
      message: 'Error occurred while adding userType ' + error.message
    });
  })
});

router.param('usertype', function (req, res, next, id) {
  var query = UserType.findById(id);
  query.exec(function (err, type) {
    if (err) {
      console.error('No userType found for ' + id);
      return next(err);
    }
    req.type = type;
    return next();
  })
});

router.put('/usertype/:userid/:usertype',auth, function (req, res, next) {
  req.user.type = req.type._id;
  var promise = req.user.save();
  promise.then(function (data) {
    console.log('UserType update for the user ' + req.user._id);
    return res.status(200).json({
      message: 'User type updated.'
    });
  }).catch(function (err) {
    console.log('Error while updating userType for user ' + req.user._id + err.message);
    return res.status(500).json({
      message: 'Error while updating userType ' + err.message
    });
  })

});

router.get('/userType/list', auth, function(req, res,next){
  UserType.find().then(function(data){
    console.log(data);
    var result=[];
    data.forEach(function(data,index){
      result.push({'id':data._id, 'type':data.type.charAt(0).toUpperCase() + data.type.slice(1)});
    })
    res.send(result);
  }).catch(function(err){
    console.log("Error while fetching userType list");
    return res.status(500).json({message:'Error while fetching userType list'});
  })
})
router.get('/usertype/:userid', auth, function (req, res, next) {
  var type = req.user.type[0];
  var promise = UserType.findById(type);
  promise.then(function(data){
    console.log("Usertype of "+ req.user._id + data.type);
    return res.status(200).json({
      type:data.type, roles:data.roles
    });
  }).catch(function(err){
    console.log("Error while fetching userType of "+ req.user._id + err.message)  ;
    return res.status(500).json({
      message:'Error while fetching userType' + err.message
    })
  })

})

router.delete('/usertype/:userid', auth, function (req, res, next) {

});

router.post('/uploadImage', auth, function(req, res, next){
  var form = new formidable.IncomingForm();
  console.log(req.body);
  form.parse(req, function(err, fields, files){

    var oldpath = files.file.path;

    var newname = shortid.generate() +"."+ files.file.name.split(".").pop();
    var newpath = path.resolve(__dirname+'/../public/images/users/' +  newname);
    fs.readFile(oldpath, function (err, data) {
      try{
      if (err) throw err;
      console.log('File read!');

      // Write the file
      fs.writeFile(newpath, data, function (err) {
          if (err) throw err;
          console.log('File written!');
      });

      // Delete the file
      fs.unlink(oldpath, function (err) {
          if (err) throw err;
          console.log('File deleted!');
      });
    } catch(err) {
        return res.status(500).json({message:"Error while uploading"});
    }
      return res.status(200).json({path:newname});
  });
  })
})
