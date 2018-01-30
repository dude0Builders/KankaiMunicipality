var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');
import jwtPermission from 'express-jwt-permissions';
import jwt from 'express-jwt';
var auth = jwt({
  secret: 'SECRET',
  userProperty: 'payload'
});
var guard = jwtPermission({
   requestProperty: 'payload',
   permissionsProperty:'permissions'
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/verifyPrint', function(req, res, next){

  request.post(
  'http://localhost:9909/verify',
  { },
  function (error, response, body) {
      if (!error && response.statusCode == 200) {
          console.log(body)
          return  res.json(JSON.parse(body));
      } else if(error){
        return res.status(500).json({message:error});
      }
      else if(response.statusCode == 404){
        return res.status(404).json({message:error})
      } else {
        return res.status(500).json({message:error})
      }
  }
);

})

router.post('/registerPrint', function(req, res, next){

  var formData = {'userid': req.body.userid};
  request.post(
  'http://localhost:9909/register',
 {form: formData},
  function (error, response, body) {
      if (!error && response.statusCode == 200) {
          console.log(body)
          res.send(body);
      }else if (!response) {
        res.status(500).json({message:'Server Not Running!'});
      }
      else {

        res.status(response.statusCode).json({message:body})
      }
  }
);

})


module.exports = {  router:router,
auth:auth, guard:guard };
