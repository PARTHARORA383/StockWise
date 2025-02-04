const express = require('express')
const {expense} = require('../Models/Expense')

const router = express.Router()


router.post('/:uid/:companyid' , async(req , res)=>{

const {uid , companyid} = req.params
const {expenseCategory , description , paymentType , expenseAmount , date} = req.body


try{

const newExpense = await expense.create({
  expenseCategory, 
  expenseAmount,
  description, 
  date, 
  paymentType
  
})

if(newExpense){
  res.status(200).json({
    msg : "created"
  })
}
}catch(e){
  res.status(400).json({
    msg : "error creating expense",
    error : e.message
  })
}
})


module.exports = router;