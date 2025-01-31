const express = require('express')
const { User } = require('../Models/User')
const router = express.Router()



router.post("/Signup", async (req, res) => {

  const { email, uid } = req.body


  try {
    if (!uid || !email) {
      return res.status(400).json({
        msg: "Invalid input fields for signup"
      })
    }
    const newUser = await User.create({
      uid: uid,
      email: email,
    })


    await newUser.save()

    return res.status(200).json({
      msg: "user succesfully created"
    })

  } catch (error) {
    res.status(401).json({
      msg: "Error creating user",
      error: error.message
    })
  }
})


router.put('/:uid/Signup', async (req, res) => {

  const {companyid } = req.body;
  const {uid} = req.params

  try{

    const  updateUser = await User.findOneAndUpdate({ uid: uid }, {
      $push: { companyid: companyid }
    })
    
    if(updateUser){

      return res.status(200).json({
        msg: "company added"
      })
    }
  }catch(e){
    res.status(400).json({
      msg : "Cannot update user"
      , error : e.message
    })
  }

})





router.get('/:uid/Signin', async (req, res) => {

  const {uid} = req.params


  try {
    const user = await User.findOne({ uid: uid })

    if (!user) {
     return res.status(401).json({
      msg : "user not found"
     })
    }

     res.status(200). json({
       user
      }
    )

  } catch (e) {
    res.status(400).json({
      msg: "cannot sign user in ",
      error: e.message
    })
  }
})



router.get('/:uid/GoogleSignin', async (req, res) => {

  const {uid} = req.params
  const {email} = req.query

  try {
    const user = await User.findOne({ uid: uid })
    console.log(uid , email)

    if (!user) {
      const newUser = await User.create({uid : uid , email : email})
      
      await newUser.save()

      return res.status(201).json({
        msg : "New user created",
        newUser
      })
    }
    else{
     res.status(200).json({
      user
     }
   )
    }



  } catch (e) {
    res.status(400).json({
      msg: "cannot sign user in ",
      error: e.message
    })
  }
})





module.exports =
  router
