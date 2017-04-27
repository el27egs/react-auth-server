const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  password: String
});

// on save hook, encrypt password:
userSchema.pre('save', function(next) {
  const user = this; // access user model

  // generate salt:
  bcrypt.genSalt(10, function(err, salt) {
    if(err) { return next(err); }
    // hash/encrypt pw with salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if(err) {return next(err); }
      // overwrite plain text pw w encryption
      user.password = hash;
      next();
    });
  });
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
