const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  status: { type: String, enum: ['verified', 'created'], default: 'created' },
  avatarURL: String,
  verificationToken: String,
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free"
    },
  token: { type: String, required: false },
});

userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.statics.updateToken = updateToken;
userSchema.statics.createVerificationToken = createVerificationToken;
userSchema.statics.findByVerificationToken = findByVerificationToken;
userSchema.statics.verifyUser= verifyUser;

async function findUserByEmail(email) {
  return this.findOne({ email });
}
async function updateToken(id, newToken) {
return this.findByIdAndUpdate(id, {
  token: newToken,
});
}

async function createVerificationToken(userId, verificationToken){
  return this.findByIdAndUpdate(userId, {
    verificationToken
  }, {
    new: true
  })
}

async function findByVerificationToken(verificationToken){
  return this.findOne({verificationToken})
}

async function verifyUser(userId){
return this.findByIdAndUpdate(
  userId,
  {
    status: "verified",
    verificationToken: null
  },
  {
    new: true,
  }
);
}

const User = mongoose.model('User', userSchema);
module.exports = User;