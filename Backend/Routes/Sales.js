const express  = require('express')
const {Sales} = require('../Models/Sales')
const {manufacturedProducts} = require('../Models/ManufacturedProducts');
const { submaterial } = require('../Models/RawMaterial');
const router = express.Router();


router.post('/:companyid' , async (req , res)=>{

  const {companyid} = req.params;
  const{billNumber , Product , dealer , quantity , rate , Productname} = req.body
  
  
  try{
  if(!billNumber || !Product || !dealer || !quantity|| !rate || !Productname ){
    return res.status(400).json({
      msg : "Invalid inputs"
    })

  }

    const CheckifSaleexist = await Sales.findOne({ company : companyid , billNumber: billNumber})

    if(CheckifSaleexist){
      return res.status(401).json({
        msg : "Bill number already exist"
      })
    }


    const newSale = new Sales({
      billNumber : billNumber,
      Product:Product,
      Productname : Productname,
      dealer : dealer ,
      quantity : quantity,
      rate : rate,
      company : companyid
    })
    
    await newSale.save();
    
    
    if(newSale){
      
      const FindProduct = await manufacturedProducts.findOne({_id : Product })
      
      for (const sub of FindProduct.Productcomposition){
        
        const updatedquantity = await submaterial.findOneAndUpdate({_id : sub.submaterialId} , {
          $inc  : {quantity : -quantity*sub.quantity}
        }, {new : true})
        console.log(sub._id)
      }
      
      return res.status(200).json({
        msg : "Sale listed "
      })
    
  }
  }catch(e){
    return res.status(400).json({
      msg : "Error listing sales",
      error : e.message
    })
  }
    

})

router.get("/:companyid" , async(req,res)=>{

  const {companyid } = req.params;

  try{
  const GetSales = await Sales.find({company : companyid})

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
