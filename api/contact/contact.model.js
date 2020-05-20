const mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.set('useCreateIndex', true);

const contactSchema = new Schema({
    name: { type: String, required: [true, "contact's First name and Last name are required"] },
    email: { type: String, validate: (value) => value.includes('@'), required: [true, "contact's e-mail is required"], unique: true },
    phone: { type: String, required: [true, "contact's phone number is required"],  unique: true },
})

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;