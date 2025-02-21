
const mongoose = require("mongoose")


const SalesSchema = new mongoose.Schema({
  date: { type: Date, default: () => new Date().setHours(0, 0, 0, 0) },
  billNumber : {type : String},
  Product : { type : mongoose.Schema.Types.ObjectId , ref : "ManufacturedProducts"},
  Productname : { type : String },
  dealer: { type: String, ref : "vendor" },
  quantity: { type: Number, required: true, min: 0 },
  rate: { type: Number, required: true, min: 0 },
  description : {type : String},
  gstRate: {type : Number},
  paymentType : {type:String , enum : ["Cash" , "Online"]},
  total_amount: { type: Number },
  total_amount_postGst : {type:Number},
  userid : {type : String ,  ref  : 'user'},
  company: { type: String, required: true, ref: 'company' },
  archived : {type : Boolean , default : false} ,
})

// Calculate totals before saving or updating
SalesSchema.pre('save', function (next) {
  this.total_amount = this.quantity * this.rate;
  this.total_amount_postGst = this.total_amount + (this.total_amount * this.gstRate / 100);
  next();
});



const Sales = mongoose.model('SalesSchema' , SalesSchema)

module.exports = {
  Sales
}