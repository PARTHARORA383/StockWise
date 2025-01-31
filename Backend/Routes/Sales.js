const express  = require('express')
const {Sales} = require('../Models/Sales')
const {manufacturedProducts} = require('../Models/ManufacturedProducts');
const { submaterial } = require('../Models/RawMaterial');
const router = express.Router();


router.post('/:uid/:companyid' , async (req , res)=>{

  const {companyid , uid } = req.params;
  const{billNumber , Product , dealer , quantity , rate , Productname} = req.body
  
  
  try{
  if(!billNumber  || !dealer || !quantity|| !rate || !Productname ){
    return res.status(400).json({
      msg : "Invalid inputs"
    })
  }

    const CheckifSaleexist = await Sales.findOne({ userid : uid ,  company : companyid , billNumber: billNumber})
    if(CheckifSaleexist){
      return res.status(409).json({
        msg : "Bill number already exist"
      })
    }


    const newSale = new Sales({
      billNumber : billNumber,
      Product:Product || null,
      Productname : Productname,
      dealer : dealer ,
      quantity : quantity,
      rate : rate,
      userid : uid,
      company : companyid
    })
    
    await newSale.save();
  
    if(!newSale){
     return res.status(500).json({
        msg : " No Sale was listed"
      })
      }
       
      res.status(200).json({
        msg : "Sale listed without product composition"
      })


      //Fix products and rawmaterial first and then fix this

      const FindProduct = await manufacturedProducts.findOne({_id : Product })

      if(FindProduct){
        for (const sub of FindProduct.Productcomposition){
          const updatedquantity = await submaterial.findOneAndUpdate({_id : sub.submaterialId} , {
            $inc  : {quantity : -quantity*sub.quantity}
          }, {new : true})
          console.log(sub._id) }
        
          if(!updatedquantity){
            return res.status(400).json({
              msg : "Sale cannot be updated"
            })
          }
          res.status(200).json({
           msg : "Sale updated with product composition"
          })
        }

  }catch(e){
    return res.status(400).json({
      msg : "Error listing sales",
      error : e.message
    })
  }
})



router.get("/:uid/:companyid" , async(req,res)=>{

  const {companyid , uid } = req.params;

  try{
  const GetSales = await Sales.find({ userid : uid , company : companyid})

  if(GetSales){
    return res.status(200).json(
      GetSales 
    )
  }
  }
catch(e){
return res.status(400).json({
  error : e.message
})
}
  
})


module.exports = 
  router
