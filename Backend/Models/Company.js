// Company.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  
country : {type : String , required : true},
state : {type : String  , required : true},
local : {type : String}

})

const companySchema = new mongoose.Schema({
  _id: { type: String, required: true }, 
  userid : {type : mongoose.Schema.Types.ObjectId , ref : 'user'
   },
  name: { type: String, required: true },
  owner :{type : String , required : true},
  address: { type: addressSchema },
  startdate : {type : Date, default : Date.now}
  ,enddate : {type : Date, required : true}


});



const Company = mongoose.model('company', companySchema); // Model name is 'company'
module.exports = { Company };
