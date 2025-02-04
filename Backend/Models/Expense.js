
const mongoose = require('mongoose')



const ExpenseSchema = new mongoose.Schema({

expenseCategory : {type : String },
date : {type : Date , default : Date.now},
expenseAmount : {type : Number},
paymentType : {type : String , enum : ["Cash"  , "Online"]} ,
description : {type :String},
userid : {type : String ,ref  : 'user' },
company : {type : String , ref : 'company'}


})


const expense = mongoose.model('Expense' , ExpenseSchema)


module.exports = {
  expense
}