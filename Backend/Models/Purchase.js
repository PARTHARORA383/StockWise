const mongoose = require('mongoose');


const PurchaseSchema = new mongoose.Schema({
  date: { type: Date, default: () => new Date().setHours(0, 0, 0, 0) },

  billing_number: { type: String },
  Product: { 
    category: {
    type : String  , required: true
  },
  item: {
    type : String 
  }
} ,
  dealer: { type: String, ref : "vendor" },
  quantity: { type: Number, required: true, min: 0 },
  rate: { type: Number, required: true, min: 0 },
  gstRate : {type : Number},
  total_amount: { type: Number },
  total_amount_postGSt : {type : Number},
  paymentType : {type : String , enum : ["Cash" , "Online"]},
  company: { type: String, required: true, ref: 'company' },
  userid  : {type : String , ref : 'user'},
  archived : {type : Boolean , default : false} ,

  // ledgeraccount : {
  //   type : mongoose.Schema.Types.ObjectId , ref : 'Ledger' ,
  
  // }
});

// Pre-save hook to calculate total_amount before saving
PurchaseSchema.pre('save', function (next) {
  this.total_amount = this.quantity * this.rate;
  this.total_amount_postGSt = this.total_amount + (this.total_amount * this.gstRate/100)
  next();
});

const Purchase = mongoose.model('purchase', PurchaseSchema);

module.exports = { Purchase };
