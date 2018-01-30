import mongoose from 'mongoose';

const slideSchema = new mongoose.Schema({
  image:String,
  caption: String,
  subcaption: String
})


mongoose.model('Slides', slideSchema, 'Slides');
