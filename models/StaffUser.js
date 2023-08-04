const { Schema, model } = require('mongoose');

const staffUserSchema = new Schema(
    {
    email: { 
        type: String, 
        unique: true, 
        required: true },
    password: { 
        type: String, 
        required: true },
    fullName: String,
    staffId: { 
        type: Number, 
        required: true },
    },
    {
        timestamps: true
    }
  );
  
  module.exports = model("StaffUser", staffUserSchema);

