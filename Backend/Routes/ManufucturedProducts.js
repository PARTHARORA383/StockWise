

const express = require('express')

const router = express.Router()


const {submaterial} = require('../Models/RawMaterial')
const {manufacturedProducts} = require('../Models/ManufacturedProducts')


router.post('/:uid/:companyid' , async (req , res)=>{

  const {companyid , uid} = req.params

  const {Productname , Productcomposition , quantity }  = req.body

    try{

      const existproduct = await manufacturedProducts.find({ userid : uid , company : companyid , Productname : Productname})
      
      if(!existproduct){
        res.status(404).json({
          msg : "Product already exist choose a different name "
        })
      }else{
        
        const SubmaterialIds = Productcomposition.map((id)=>{id.submaterialId})
        const submaterialexist = await submaterial.find({_id : {$in : SubmaterialIds}})
        
        if(submaterialexist){
          
          const Product = new manufacturedProducts({
            Productname : Productname,
            Productcomposition : Productcomposition,
            quantity : quantity,
            userid : uid,
            company : companyid
          })
          await Product.save();
          return  res.status(200).json({
            msg : "Product Listed"
          })
        }
        else{
          return res.status(400)
        }
      }
      
    }catch(e){
      res.status(400).json({
        msg : "Request Failed"
      })
    }

})



router.get("/:uid/:companyid" , async(req , res)=>{

  const {companyid , uid} = req.params

  const existproduct = await manufacturedProducts.find({ userid : uid ,company : companyid})
  
  if(existproduct){
    return res.status(200).json(existproduct)
  }
  else{
    return res.status(400).json({
      msg : " Products doesn't exist"
    })
  }
})



router.put('/:uid/:companyid/:manufacturingid' , async(req , res)=>{

  const {companyid , manufacturingid  , uid} = req.params;
  const {updatedquantity} = req.body

  try{

    const checkifexistproduct = await manufacturedProducts.findOne({ userid : uid , company : companyid  , _id : manufacturingid})
    
    if(checkifexistproduct){
      
      const updatedProductQuantity =  await manufacturedProducts.findOneAndUpdate({ company : companyid , _id : manufacturingid } , { 
        
        $inc: {quantity : updatedquantity}
      },  { new: true })
      
      return res.status(200).json({ message: 'updated product' })
    }else{
      return res.status(401).json({ message: 'Failed to update product quantity' })
    }
  }catch(e){
    res.status(400).json({
      error : e.message
    })
  }
    
})


module.exports = router;