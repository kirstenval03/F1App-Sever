const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: String,
  username: String,
  isStaff: {
    type: Boolean,
    default: false // By default, all users are regular users
  },
  team: {
    type: String,
    default: null // By default, team is null for all users
  }
}, {
  timestamps: true
});

userSchema.pre('save', function (next) {
  // Check if the email contains the domain "@formula1.com"
  if (this.email.endsWith('@formula1.com')) {
    this.isStaff = true;
  }

  next();
});

module.exports = model("User", userSchema);
