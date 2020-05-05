const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "contact's first name and last name is required"],
  },
  email: {
    type: String,
    required: [true, "contact's e-mail required"],
    unique: true,
  },
  phone: {
    type: String,
    required: [true, "contact's phone number is required"],
    unique: true,
  },
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
