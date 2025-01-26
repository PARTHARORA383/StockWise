const express = require('express')
const {User} = require('../Models/User')
const router = express.Router()

  

router.post("/Signup" , async (req, res)=>{

  const {email , uid } = req.body


  try{
    if(!uid || !email ){
      return res.status(400).json({
        msg : "Invalid input fields for signup"
      })
    }
    const newUser = await User.create({
      uid : uid, 
      email : email,
    })


   await newUser.save()

   return res.status(200).json({
    msg : "user succesfully created"
   })

  }catch(error){
    res.status(401).json({
      msg : "Error creating user" ,
      error : error.message
    })
  }
 })


 router.put('/Signup' , async (req ,res)=>{

  const { uid , companyid} = req.body ;

  const updateUser = await User.findOneAndUpdate({uid : uid },{
   $push :{ companyid : companyid}
    } )

  return res.status(200).json({
    msg : "company added"
  })

 })







module.exports =
  router

