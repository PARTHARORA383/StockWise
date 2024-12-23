
const { raw } = require('express');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const subrawmaterial = new mongoose.Schema({
  
  name : {type : String , required : true},
  quantity :{type : Number},
  unit : {type: String},
  rawmaterial : {type : mongoose.Schema.Types.ObjectId  ,  ref  : "rawmaterial"},
  company : {type : String , ref : 'company'}

  
})

const submaterial = mongoose.model('submaterial' , subrawmaterial)


const RawMaterial = new mongoose.Schema({

catogory : {type : String , required : true},
submaterial : [{type : mongoose.Schema.Types.ObjectId  ,  ref  : "submaterial"}],
company : {type : String , ref : 'company'}
  
})

const rawmaterial = mongoose.model('rawmaterial' , RawMaterial)

module.exports ={
rawmaterial ,
submaterial
}