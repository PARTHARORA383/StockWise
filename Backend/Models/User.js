
const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
  uid: {type : String  } ,
  companyid : {type:String, ref : 'company'},
  email: { type: String, required: true, unique: true },   // User email
  name: { type: String },                                  // Full name of the user
  picture: { type: String },                               // Profile picture URL            // Roles: 'admin', 'user', etc., // Linked company IDs
  createdAt: { type: Date, default: Date.now },            // Account creation date
})

const User = mongoose.model('user' , UserSchema)

module.exports = {
  User
}