import {router, auth} from './index';
import mongoose from 'mongoose';
import '../models/slideModel';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import shortid from 'shortid';

const Slide = mongoose.model('Slides');

router.post('/slide/create', auth, function(req, res, next){
  if(!req.body.image || !req.body.caption){
    return res.status(400).json({message:'Please fill all the fields'});
  }
  const slide = new Slide();
  slide.image = req.sanitize(req.body.image);
  slide.caption = req.sanitize(req.body.caption);
  slide.subcaption = req.sanitize(req.body.subcaption);
  slide.save().then(function(slide){
    console.log("Successfully created the slide");
    return res.status(200).json({message:'Successfully Created Slide'});
  }).catch(function(err){
    console.log("Error while creating slide");
    return res.status(500).json({message:'Error occurred while creating slide '+ err.message});
  })
})

router.get('/slide/all', auth, function(req, res, next){
  Slide.find(function(err, slides){
    if(err){
      console.log("Error while fetching slides list.");
      return res.status(500).json({message:'Error while fetching slides '+ err.message});
    }
    return res.status(200).json(slides);
  })
})

router.param('slideid', function(req, res, next, id ){
 const query = Slide.findById(id);
 query.exec().then(function(slide){
   if(!slide)
     return next(new Error('No slide found!'));
    req.slide = slide;
    return next();
 }).catch(function(err){
   return next(err);
 })
})

router.put('/slide/:slideid', auth, function(req, res, next){
  const slide = req.slide;
  slide.image = req.sanitize(req.body.image) || slide.image;
  slide.caption = req.sanitize(req.body.caption) || slide.caption;
  slide.subcaption = req.sanitize(req.body.subcaption) || slide.subcaption;
  slide.save().then(function(data){
    console.log("Successfull updated the slide");
    return res.status(200).json({message:"Succcessfully updated slide."});
  }).catch(function(err){
    console.log('Error occurred while updating slide');
    return res.status(500).json({message:'Error occurred while updating slide '+ err.message});
  })
})

router.get('/slide/:slideid', auth,  function(req, res, next){
    return res.status(200).json(req.slide);
})

router.delete('/slide/:slideid', auth, function(req, res, next){
   req.slide.remove().then(function(slide){
     return res.status(200).json({message:'Slide removed successfully!'});
   }).catch(function(err){
     return res.status(500).json({message:'Error occurred while removing slide '+ err.message});
   })
})

router.post('/slide/uploadImage', auth, function(req, res, next){
  var form = new formidable.IncomingForm();
  console.log(req.body);
  form.parse(req, function(err, fields, files){

    var oldpath = files.file.path;

    var newname = shortid.generate() +"."+ files.file.name.split(".").pop();
    var newpath = path.resolve(__dirname+'/../public/images/' +  newname);
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
