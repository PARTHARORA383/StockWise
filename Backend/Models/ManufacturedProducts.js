
const mongoose = require('mongoose')

const ManufuctureProducts = new mongoose.Schema({ 

  Productname : {type : String , required : true},

  quantity : {type : Number},
  userid : {type : String , ref : 'user'} ,
  company : {type : String, ref : 'company'}
})

const manufacturedProducts = mongoose.model('ManufacturedProducts' , ManufuctureProducts);

module.exports ={
  manufacturedProducts
}