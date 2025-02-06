
const mongoose = require('mongoose')


const expensename = new mongoose.Schema({
  name : {type : String},
  userid : {type : String ,ref  : 'user' },
company : {type : String , ref : 'company'}
})


const expensetype =  mongoose.model('Expensecategory' , expensename)


const ExpenseSchema = new mongoose.Schema({

expenseCategory : {type : mongoose.Schema.Types.ObjectId  , ref : "Expensecategory"},
expensename : {type : String},
date : {type : Date , default : Date.now},
expenseAmount : {type : Number},
paymentType : {type : String , enum : ["Cash"  , "Online"]} ,
description : {type :String},
userid : {type : String ,ref  : 'user' },
company : {type : String , ref : 'company'}
})


const expense = mongoose.model('Expense' , ExpenseSchema)


module.exports = {
  expense,
  expensetype
}