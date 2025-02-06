const express = require('express')
const {expense , expensetype} = require('../Models/Expense')

const router = express.Router()


router.post('/:uid/:companyid' , async(req , res)=>{

const {uid , companyid} = req.params
const {expensename , description , paymentType , expenseAmount , date} = req.body


try{

  const checkifexpensecategory = await expensetype.findOne({  
    userid : uid ,
    company : companyid ,
    name: { $regex: new RegExp(`^${expensename}$`, 'i') }
  
  })

  let expenseid = "";


  if(checkifexpensecategory){
   expenseid = checkifexpensecategory._id
   console.log(expenseid)
  }
  else{
    const creating_category = await expensetype.create({
      userid:uid,
      company : companyid,
      name : expensename
    }
    )

    await creating_category.save();
    console.log("this block of code is running" + expenseid)
    expenseid = creating_category._id;
  }

const newExpense = await expense.create({
  expenseCategory : expenseid ,
  expensename : expensename,
  expenseAmount,
  description, 
  date, 
  paymentType ,
  userid : uid ,
  company : companyid 
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



router.get('/:uid/:companyid' , async(req , res)=>{

  const {uid , companyid} = req.params
  try{
  const fetchCategories = await expensetype.find({userid:uid, company:companyid})
  const fetchExpenses  = await expense.find({userid : uid  , company : companyid})
  
  if(fetchExpenses){
    res.status(200).json({
      msg : "Expenses Fetched",
      fetchExpenses ,
      fetchCategories
    })
  }
  }catch(e){
    res.status(400).json({
      msg : "error fetching expense",
      error : e.message
    })
  }
  })


router.get('/:uid/:companyid/:expenseid' , async(req , res)=>{

  const {uid , companyid , expenseid} = req.params
  try{
  
  const fetchExpense  = await expense.findOne({userid : uid  , company : companyid , _id : expenseid})
  
  if(fetchExpense){
    res.status(200).json({
      msg : "Expenses Fetched",
      fetchExpense
    })
  }
  }catch(e){
    res.status(400).json({
      msg : "error fetching expense",
      error : e.message
    })
  }
  })


  router.put('/:uid/:companyid/:expenseid' , async(req , res)=>{

    const {uid , companyid , expenseid} = req.params
    const {expenseCategory , description , paymentType , expenseAmount , date} = req.body
    
    
    try{
    
      const ifExpenseExists = await expense.findOne({ userid : uid , company : companyid , _id : expenseid})

      
    
    if(ifExpenseExists){


      const updateExpense = await expense.findOneAndUpdate({userid : uid , company : companyid , _id : expenseid} , {
        expenseCategory, 
        expenseAmount,
        description, 
        date, 
        paymentType 
      })

      if(updateExpense){
       return res.status(200).json({
          msg : "created"
        })
      }
      else {
        return res.status(400).json({
          msg : "Failed to update Expense"
        })
      }
    }
    else{return res.status(400).json({
      msg : "Expense does not exists"
    })}
    }catch(e){
      res.status(400).json({
        msg : "error creating expense",
        error : e.message
      })
    }
    })
    

  
    
router.delete('/:uid/:companyid/:expenseid' , async(req , res)=>{

  const {uid , companyid , expenseid} = req.params
  try{
  
  const fetchExpense  = await expense.findOneAndDelete({userid : uid  , company : companyid , _id : expenseid})
  
  if(fetchExpense){
    res.status(200).json({
      msg : "Expenses Deleted",
    })
  }
  }catch(e){
    res.status(400).json({
      msg : "error Deletting expense",
      error : e.message
    })
  }
  })


module.exports = router;