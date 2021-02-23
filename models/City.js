const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({

 name: {
        type: String,
        required:true
  },
  country: {
      type: String,
      required:true
  },
 description: {
    type: String,
    required: [true, 'required, between 50 and 250 characters'],
    maxlength: [250, 'max 250 characters'],
    minlength: [50, 'min 50 characters']
  },
  img: {
    type: String,
    required: true
  }
    
});

module.exports = City = mongoose.model('city', CitySchema);