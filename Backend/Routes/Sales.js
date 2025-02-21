const express  = require('express')
const {Sales} = require('../Models/Sales')
const {manufacturedProducts} = require('../Models/ManufacturedProducts');
const { submaterial } = require('../Models/RawMaterial');
const router = express.Router();


router.post('/:uid/:companyid' , async (req , res)=>{

  const {companyid , uid } = req.params;
  const{billNumber , Product , dealer , quantity , rate , Productname , paymentType , gstRate , description} = req.body
  
  
  try{
  // if(!billNumber  || !dealer || !quantity|| !rate || !Productname ){
  //   return res.status(400).json({
  //     msg : "Invalid inputs"
  //   })
  // }

    // const CheckifSaleexist = await Sales.findOne({ userid : uid ,  company : companyid , billNumber: billNumber})
    // if(CheckifSaleexist){
    //   return res.status(409).json({
    //     msg : "Bill number already exist"
    //   })
    // }


    const newSale = new Sales({
      billNumber : billNumber,
      Product:Product || null,
      Productname : Productname,
      dealer : dealer ,
      quantity : quantity,
      paymentType : paymentType ,
      description,
      gstRate,
      total_amount : quantity * rate,
      total_amount_postGst : quantity * rate + (quantity * rate * gstRate / 100),
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


router.put("/:uid/:companyid/:id" , async(req,res)=>{

  const {uid , companyid , id} = req.params;
  const {Productname , quantity , rate , description , gstRate } = req.body;

  

  try{
    
  const oldSale = await Sales.findOne({_id : id , userid : uid , company : companyid})
  
  const newrate = rate !== undefined ? rate : oldSale.rate;
  const newgstRate = gstRate !== undefined ? gstRate : oldSale.gstRate;
  const newquantity = quantity !== undefined ? quantity : oldSale.quantity;



    const updatedSale = await Sales.findOneAndUpdate({_id : id , userid : uid , company : companyid} , {
      Productname , quantity , rate , description , gstRate , total_amount : newquantity * newrate,
      total_amount_postGst : newquantity * newrate + (newquantity * newrate * newgstRate / 100),
    }, {new : true})

    

    
    if(!updatedSale){

      return res.status(400).json({
        msg : "Sale not found"
      })
    } 
    res.status(200).json({
      msg : "Sale updated"
    })
  }
  catch(e){
    return res.status(400).json({
      error : e.message
    })
  }
  
})

router.delete("/:uid/:companyid/:id" , async(req,res)=>{

  const {uid , companyid , id} = req.params;
  
  try{
    const deletedSale = await Sales.findOneAndDelete({_id : id , userid : uid , company : companyid})
    if(!deletedSale){
      return res.status(400).json({
        msg : "Sale not found"
      })
    }
    res.status(200).json({
      msg : "Sale deleted"
    })
  } 
  catch(e){
    return res.status(400).json({
      error : e.message
    })
  }
})  

module.exports = router
