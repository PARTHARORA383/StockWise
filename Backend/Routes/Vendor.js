const express = require('express');
const {vendor} = require('../Models/Vendor')
const router = express.Router();



router.post('/:uid/:companyid' , async (req , res)=>{

const {uid , companyid} = req.params;
const { current_balance , dealer_type , address , GSTIN , Phone_number } = req.body
const name = req.body.name.trim().replace(/\s+/g, "") 

try{

const ifVendorExist = await vendor.findOne({
  userid : uid , company : companyid , name : name 
})  


if(ifVendorExist){
const updatebalance =   await vendor.findOneAndUpdate({
  userid : uid , company : companyid , name : { $regex: new RegExp(`^${name}$`, 'i') } 
} , {
  $inc: { current_balance : current_balance }
})  

if(updatebalance){
  return res.status(200).json({
    msg : "Vendor already exist balance updated"
  })
}
}
else{
  const newVendor = await vendor.create({
    name : name ,
    current_balance  : current_balance,
    dealer_type : dealer_type,
    address : address,
    GSTIN : GSTIN,
    Phone_number : Phone_number,
    userid : uid ,
    company : companyid
  })

  await newVendor.save();

  if(newVendor){
    return res.status(200).json({
      msg : "Vendor Created"
    })
  }
}
}catch(e){
return res.status(400).json({
  msg : "error creating a vendor",
  error : e.message
})

}

})


router.get('/:uid/:companyid' , async (req ,res)=>{
  const {uid , companyid} = req.params;
try{
  const fetchVendors = await vendor.find({userid : uid , company: companyid})
  
  if(fetchVendors){
    return res.status(200).json({
      fetchVendors
    })
  }
  }catch(e){
  return res.status(400).json({
    msg : "error creating a vendor",
    error : e.message
  })
  }
})



router.get('/:uid/:companyid/:name' , async (req ,res)=>{
  const {uid , companyid } = req.params;
  const name = req.params.name.trim().replace(/\s+/g, "") 

try{
  const fetchVendor = await vendor.findOne({userid : uid , company: companyid , name : { $regex: new RegExp(`^${name}$`, 'i') }})
  if(fetchVendor){
    return res.status(200).json({
      fetchVendor
    })
  }
  else{
    return res.status(400).json({
      msg : "Vendor does not exist"
    })
  }
  }catch(e){
  return res.status(400).json({
    msg : "error creating a vendor",
    error : e.message
  })
  }
})








module.exports = router