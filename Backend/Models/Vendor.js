
const mongoose  = require('mongoose')



const  Dealer_address = new mongoose.Schema({
  
country : {type : String },
state : {type : String  },
local : {type : String}

})


const VendorSchema = new mongoose.Schema({

  name : {type : String , required : true },
  dealer_type : {type : String ,  enum : ['Purchase' , 'Sale' , 'Other']},
  current_balance : {type : Number},
  GSTIN : {type : String},
  address : {type : Dealer_address},
  phone_number : {type : Number},
  date : {type : Date , default : Date.now()},
  description : {type : String},
  userid : {type : String  , ref : "user"},
  company : {type : String  , ref : "company"},
})


const vendor = mongoose.model('vendor' , VendorSchema)

module.exports = {
  vendor
}