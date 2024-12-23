
const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
  auth0Id : {type : String , required : true , unique : true } ,
  email: { type: String, required: true, unique: true },   // User email
  name: { type: String },                                  // Full name of the user
  picture: { type: String },                               // Profile picture URL
  roles: { type: [String], default: ['user'] },            // Roles: 'admin', 'user', etc., // Linked company IDs
  createdAt: { type: Date, default: Date.now },            // Account creation date
})

const User = mongoose.model('user' , UserSchema)

module.exports = {
  User
}