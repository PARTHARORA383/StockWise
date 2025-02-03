const express = require("express");
const {Purchase} = require('../Models/Purchase')
const router = express.Router();
const {rawmaterial , submaterial} = require('../Models/RawMaterial')


router.post("/:uid/:companyid", async function(req, res) {
  const{ companyid , uid }= req.params
  
  const { billing_number, dealer, quantity, rate, Product , date } = req.body;
  const { category, item } = Product || {};

  try {
    // Validate the company ID
    if (!companyid) {
      return res.status(400).json({
        msg: 'Company ID not found',
      });
    }

    // Validate all required fields
    if (!billing_number || !category || !item || !dealer || !quantity || !rate ) {
      return res.status(401).json({
        msg: 'All fields are required',
      });
    } 

    const checkifbillnumberexist = await Purchase.findOne({userid:uid , company : companyid , billing_number : billing_number})
    if(checkifbillnumberexist){
      return res.status(400).json({
        msg : "Invoive number already exist"
      })
    }

    // Check if rawmaterial (category) exists



      
        // Create a new purchase if submaterial doesn't exist
        const new_purchase = new Purchase({
          date : date ,
          billing_number,
          dealer,
          Product: {
            category,
            item,
          },
          rate,
          quantity,
          company: companyid,
          userid : uid 
          
        });

        await new_purchase.save();

        return res.status(200).json({
          message: "Purchase complete",
        });
     
     
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      msg: "Cannot add purchase",
    });
  }
});



router.put("/:uid/:companyid/:billing_number" , async(req , res)=>{

  const { companyid , billing_number} = req.params
  const { BillNumber ,dealer, quantity, rate, Product } = req.body;
  const { category, item } = Product || {};

  try{

    
    const updatePurchase = await Purchase.findOneAndUpdate({company: companyid , billing_number : billing_number ,
      
    },{
      billing_number : BillNumber ,
      dealer,
      Product: {
        category,
        item,
      },
      rate,
      quantity,
    })
    
    if(updatePurchase){

      return res.status(200).json({msg : "Purchase updated"})
    }
  }catch(e){
    res.status(401).json({msg : "update failed"})
  }

})


router.get(`/:uid/:companyid` ,async (req , res)=>{
  const{ companyid , uid }= req.params
  
  
  try {
    const purchases = await Purchase.find({userid : uid , company: companyid }).sort({ date: -1 }); //;
    res.status(200).json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ message: "Error fetching purchases", error: error.message });
  }
})

router.delete("/:uid/:companyid/:billing_number" , async (req , res)=>{
  const {companyid , billing_number}  = req.params
    console.log(billing_number)

  try{

    const DeletePurchase = await Purchase.findOneAndDelete({ company : companyid , billing_number : billing_number})
    
    if(DeletePurchase){
      return res.status(200).json({
        msg : " Purchase Deleted"
      })
    }
  }catch(e){
    return res.status(400).json({
      msg : "error Deleting Purchase"
    })
  }

})



module.exports = router;