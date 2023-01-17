const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Cannot be blank'],
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, 'Cannot be blank'],
      unique: true,
      index: true,
      validate: [isEmail, 'invalid email'],
    },
    password: {
      type: String,
      required: [true, 'Cannot be blank'],
    },
    picture: {
      type: String,
    },
    newMessages: {
      type: Object,
      default: {},
    },
    status: {
      type: String,
      default: 'online',
    },
  },
  /*By default mongoose remove empty object, if you're trying to find it, it will be 'undefined'
    but by setting {minimize:false} , it will store empty object, and result in {} instead
    of 'undefined
  */
  { minimize: false }
);

//Hash the password before we save the user
UserSchema.pre('save', function (next) {
  const user = this;

  //If the password isn't modify
  if (!user.isModified('password')) return next();

  //If the password is modify
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

//Sending back user, without sending back the password
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

// Methods to check user email+password (credentials)
UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('invalid email or password');
  return user;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
