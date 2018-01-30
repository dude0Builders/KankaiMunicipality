import {
  auth
} from './index';
import router from './userAPI';
import tokenModel from '../models/tokenModel';
import mongoose from 'mongoose';
import moment from 'moment';
import pushserver from '../notification/pushserver';
import MessageType  from '../notification/messagetype';



var Token = mongoose.model('Tokens');

router.post('/token/create', auth, function (req, res, next) {
  if (!req.body.tokennumber || !req.body.createdby || !req.body.department) {
    return res.status(400).json({
      message: 'Please fill all the fields.'
    })
  }

  var token = new Token();
  token.tokennumber = req.sanitize(req.body.tokennumber);
  token.visitorname = req.sanitize(req.body.visitorname);
  token.createdby = req.sanitize(req.body.createdby);
  token.department = req.sanitize(req.body.department);
  token.phoneno = req.sanitize(req.body.phoneno);
  console.log(moment().format());
  token.date = moment().format();
  token.wardno = req.sanitize(req.body.wardno);
  token.handled = false;
  token.description = req.sanitize(req.body.description);
  token.save().then(function (data) {
    console.log("Token Saved !");
    res.json({
      id: data._id,
      tokennumber: data.tokennumber
    })


    //TODO: Fire the push notification


     pushserver.sendMessage({messageType:MessageType.TOKENADDED,
      wardno : data.wardno,
      departmenttype: data.department
     },data);


    return;
  }).catch(function (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error while saving token'
    })
  })

})

router.param('tokenid', function (req, rex, next, id) {
  var query = Token.findById(id);
  query.exec(function (err, token) {
    if (err) {
      console.log('No such Token');
      return next(err);
    }
    if (!token) {
      console.log('No such token');
      return next(new Error('Cannot find the Token'));
    }

    req.token = token;
    return next();
  })
})

router.put('/token/handle/:tokenid/:userid', auth, function (req, res, next) {
  req.token.handledby = req.user._id;
  req.token.save().then(function (data) {
    data.populate({path:'handledby', select:'firstname -_id'}, function(err, token){
      console.log("Token updated!!");
    res.json({
      tokennumber: token.tokennumber,
      handledby: token.handledby
    })


    //TODO: Fire push notification
    data.viewingdepartment(function(err,department){
      if(err){
        console.log("Error while fetching viwer id" + err);
        return;
      }

      pushserver.sendMessage({messageType:MessageType.TOKENCALLED,
        wardno : token.wardno,
        departmenttype: department
       },token);
    })
  })

  }).catch(function (err) {
    console.log("Error while assigning handler" + err);
    return res.status(500).json({
      message: 'Error occurred while assigning handler'
    });
  })
});

router.put('/token/handled/:tokenid/:userid', auth, function (req, res, next) {
  var token = req.token;
  token.handled = true;
  token.handledby = req.user._id;
  token.remarks = req.body.remarks;
  token.save().then(function (data) {
    console.log('Token handled successfully');
    res.json({
      tokennumber: data.tokennumber,
      handledby: data.handledby
    })

    //TODO: Fire push notification message

  }).catch(function (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error while updating token'
    })
  });
})

router.get('/token/list', auth, function (req, res, next) {
  Token.find(function (err, tokens) {
    if (err)
      res.status(500).json({
        message: 'Error while fetching token list'
      })

    return res.json(tokens);
  })
})



router.get('/token/today/:wardno', auth, function (req, res, next) {
  var wardno = req.params.wardno;
  console.log(wardno);
  let today = moment().startOf('day');
  let tomorrow = moment(today).add(1, 'days');


  Token.find({
    '$and': [{
      'date': {
        '$gte': today.toDate(),
        '$lt': tomorrow.toDate()
      }
    }, {
      'handled': false
    },{'wardno':wardno}]
  }).populate('createdby','username -_id').populate({path:'handledby',select:'firstname -_id'}).populate('department','type -_id').then(function (data) {

    return res.json(data);
  }).catch(function (err) {
    console.log("Error while fetching today token")
  })
})

router.get('/token/:token', auth, function (req, res, next) {
  return res.json(req.token);
})

/*
function generateToken(lasttoken) {
  var token = lasttoken.split("");
  var result = "A00";
  var dumm = lasttoken.split("");

   if(lasttoken.charCodeAt(2)==57){
      dumm[2] = 0;
      dumm[1] = String.fromCharCode(lasttoken.charCodeAt(1)++);
    return dumm.join("");
   } if(lasttoken.charCodeAt(1)==57){
     dumm[1] = 0;
     dum,[0] = String.fromCharCode(lasttoken.charCodeAt(0)++);
     return dumm.toString();
   }
   if(lasttoken.charCodeAt(0)==90){
      dumm[2] = 0;
      dumm[1] = 0;
      dumm[0] = 'A';
      return dumm.toString();
   }

   return result;

}
*/
