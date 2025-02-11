const express = require("express");
const { Purchase } = require('../Models/Purchase')
const router = express.Router();
const { vendor } = require('../Models/Vendor')
const { rawmaterial, submaterial } = require('../Models/RawMaterial')


router.post("/:uid/:companyid", async function (req, res) {
  const { companyid, uid } = req.params

  const { billing_number,  quantity, rate, Product, date , paymentType , gstRate } = req.body;
  const { category, item } = Product || {};
  const dealer = req.body.dealer.trim().replace(/\s/g, "")

  try {
    // Validate the company ID
    if (!companyid) {
      return res.status(400).json({
        msg: 'Company ID not found',
      });
    }

    // Validate all required fields
    

    // const checkifbillnumberexist = await Purchase.findOne({ userid: uid, company: companyid, billing_number: billing_number })
    // if (checkifbillnumberexist) {
    //   return res.status(400).json({
    //     msg: "Invoive number already exist"
    //   })
    // }


    const new_purchase = new Purchase({
      date: date,
      billing_number,
      dealer,
      Product: {
        category,
        item,
      },
      rate,
      quantity,
      paymentType ,
      gstRate : gstRate,
      company: companyid,
      userid: uid

    });

    await new_purchase.save();

    if (new_purchase) {

      // Check if Dealer exists

      const checkifVendorExist = await vendor.findOne({ userid: uid, company: companyid, name: { $regex: new RegExp(`^${dealer}$`, 'i') } })

      if (checkifVendorExist){
        const updatebalance = await vendor.findOneAndUpdate({ userid: uid, company: companyid, name: { $regex: new RegExp(`^${dealer}$`, 'i') }  }, {
          $inc: { current_balance: rate * quantity }
        })
        if(updatebalance){
          return res.status(200).json({
            message: "Purchase complete and balance updated",
          });
        }
      }
      else{
        const newVendor = await vendor.create({userid:uid , company : companyid ,
          name : dealer,
          current_balance : rate*quantity,
          dealer_type : "Purchase"
        })

        if(newVendor){
          return res.status(200).json({
            msg : "Purchase complete and vendor also created"
          })
        }
      }
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      msg: "Cannot add purchase",
    });
  }
});



router.put("/:uid/:companyid/:billing_number", async (req, res) => {

  const { companyid, billing_number } = req.params
  const { BillNumber, dealer, quantity, rate, Product  } = req.body;
  const { category, item } = Product || {};

  try {


    const updatePurchase = await Purchase.findOneAndUpdate({
      company: companyid, billing_number: billing_number,

    }, {
      billing_number: BillNumber,
      dealer,
      Product: {
        category,
        item,
      },
      rate,
      quantity,
    })

    if (updatePurchase) {

      return res.status(200).json({ msg: "Purchase updated" })
    }
  } catch (e) {
    res.status(401).json({ msg: "update failed" })
  }

})


router.get(`/:uid/:companyid`, async (req, res) => {
  const { companyid, uid } = req.params


  try {
    const purchases = await Purchase.find({ userid: uid, company: companyid }).sort({ date: -1 }); //;
    res.status(200).json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ message: "Error fetching purchases", error: error.message });
  }
})

router.delete("/:uid/:companyid/:billing_number", async (req, res) => {
  const { companyid, billing_number } = req.params
  console.log(billing_number)

  try {

    const DeletePurchase = await Purchase.findOneAndDelete({ company: companyid, billing_number: billing_number })

    if (DeletePurchase) {
      return res.status(200).json({
        msg: " Purchase Deleted"
      })
    }
  } catch (e) {
    return res.status(400).json({
      msg: "error Deleting Purchase"
    })
  }

})



module.exports = router;