
const mongoose  = require('mongoose')


const LedgerAccount = new mongoose.Schema({

  name : {type : String , required : true  , enum : ['Purchase' , 'Sale']},
  description : {type : String}
})


const Ledger = mongoose.model('Ledger' , LedgerAccount)

mongoose.module = {
  Ledger
}