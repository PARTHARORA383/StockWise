
const mongoose = require("mongoose")


const SalesSchema = new mongoose.Schema({
  date: { type: Date, default: () => new Date().setHours(0, 0, 0, 0) },
  billNumber : {type : String},
  Product : { type : mongoose.Schema.Types.ObjectId , ref : "ManufacturedProducts"},
  Productname : { type : String },
  dealer: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  rate: { type: Number, required: true, min: 0 },
  total_amount: { type: Number },
  company: { type: String, required: true, ref: 'company' },
  archived : {type : Boolean , default : false} ,
})


SalesSchema.pre('save', function (next) {
  this.total_amount = this.quantity * this.rate;
  next();
});

const Sales = mongoose.model('SalesSchema' , SalesSchema)

module.exports = {
  Sales
}