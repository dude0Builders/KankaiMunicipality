import {

  auth
} from './index';
import departmentType from '../models/departmentModel';
import router from './userAPI';
import mongoose from 'mongoose';

var DepartmentType = mongoose.model("DepartmentType");

router.get('/departmenttype/list', auth, function (req, res, next) {
  DepartmentType.find(function (err, deps) {
    if (err)
      res.status.apply(500).json({
        message: 'Error while fetching departype list'
      })
    var result = deps.map(function (dep, index) {
      return {
        id: dep._id,
        type: dep.type.charAt(0).toUpperCase() + dep.type.slice(1),
        description: dep.description
      }
    });

    res.send(result);
  })
})

router.post('/departmenttype/create', auth, function (req, res, next) {
  var departmentType = new DepartmentType();
  var type = req.sanitize(req.body.type);
  var description = req.sanitize(req.body.description);
  if (!type || !description) {
    console.log("Please fill all the fields");
    return res.status(403).send({
      message: "Invalid Input"
    });
  }
  departmentType.type = type;
  departmentType.description = description;
  departmentType.save().then(function (data) {
    console.log("DepartmentType added " + type);
    return res.status(200).json({
      message: 'Departmenttype successfully added'
    });
  }).catch(function (error) {
    console.log('Error occurred while adding departmentType');
    return res.status(500).json({
      message: 'Error occurred while adding departmentType'
    })
  });
});

router.param('departmenttypeid', function (req, res, next, id) {
  var query = DepartmentType.findById(id);
  query.exec(function (err, type) {
    if (err) {
      console.log("No departmenttype found for " + id);
      return next(err);
    }
    if (!type) {
      console.log("No such department");
      return next(new Error('Cannot fine the department'));
    }
    req.depttype = type;
    return next();
  });
})



router.put('/departmenttype/:userid/:departmenttypeid', auth, function (req, res, next) {
  req.user.departmenttype = req.depttype._id;
  req.user.save().then(function (data) {
    console.log("Departmenttype updated for user " + req.user._id);
    return res.status(200).json({
      message: 'Department type added.'
    })
  }).catch(function (err) {
    console.log('Error while updating departmenttype for user' + err.message);
    return res.status(500).json({
      message: 'Error while updating departmenttype ' + err.message
    });
  })
})

router.get('/departmenttype/:userid', auth, function (req, res, next) {
  var type = req.user.departmenttype;
  DepartmentType.findById(type).then(function (data) {
    console.log('Departmenttype of ' + req.user._id + data.type);
    return res.status(200).json({
      departmenttype: data.type,
      description: data.description
    });
  }).catch(function (err) {
    console.log("Error while fetching departmentype of " + req.user._id);
    return res.status(500).json({
      message: 'Error while fetching departmenttype ' + err.message
    });
  });
})

