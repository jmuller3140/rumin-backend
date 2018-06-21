const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName:{
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  created_At: Date
});

module.exports = mongoose.model('User', userSchema);