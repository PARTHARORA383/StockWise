const express = require("express")
const { rawmaterial, submaterial } = require('../Models/RawMaterial')
const router = express.Router();


//CREATING A RAW MATERIAL 
router.post("/:uid/:companyid", async (req, res) => {
  const { companyid, uid } = req.params;
  const { catogory } = req.body;

  try {
    // Check if the raw material already exists for the company
    const alreadyexist = await rawmaterial.findOne({ userid: uid, catogory: catogory, company: companyid });

    if (!alreadyexist) {
      const newRawmaterial = new rawmaterial({
        catogory: catogory,
        userid: uid,
        company: companyid
      });

      // Save the raw material
      await newRawmaterial.save();

      res.status(201).json({ msg: "Raw material created successfully" });
    } else {
      return res.status(400).json({
        msg: "Raw material already exists"
      });
    }
  } catch (e) {
    return res.status(400).json({
      msg: "Cannot create raw material",
      error: e.message
    });
  }
});

router.put('/:uid/:companyid/:rawmaterialid', async (req, res) => {

  const { companyid, rawmaterialid, uid } = req.params
  const { subrawmaterial } = req.body


  try {

    //Check if the rawmaterial exists or not
    const rawmaterialexist = await rawmaterial.findOne({ userid: uid, company: companyid, _id: rawmaterialid })


    if (!rawmaterialexist) {
      res.status(400).json({
        msg: "Raw material does not exist"
      })

    }

    //Loop through the inputs 
    for (const sub of subrawmaterial) {

      const subrawmaterialsexist = await submaterial.findOne({ userid: uid, company: companyid, rawmaterial: rawmaterialid, name: sub.name })

      if (!subrawmaterialsexist) {

        const updatesubmaterial = new submaterial({
          name: sub.name,
          quantity: sub.quantity,
          unit: sub.unit,
          rawmaterial: rawmaterialid,
          userid: uid,
          company: companyid

        })

        await updatesubmaterial.save()


        if (!Array.isArray(rawmaterialexist.submaterial)) {
          console.log("not an array")
          return res.status(400)
        }
        rawmaterialexist.submaterial.push(updatesubmaterial._id);

        await rawmaterialexist.save();

        return res.status(200).json({
          msg: "Raw material updated"
        })
      }
      else {
        return res.status(409).json({
          msg: "submaterial already exist"
        })
      }
    }
  } catch (e) {
    res.status(400).json({
      msg: "Cannot add submaterial",
      error: e.message
    })
  }
})


//UPDATE SUBMATERIAL FOR ITS QUANTITY WHEN I ADD A NEW PURCHASE OR I SELL A PRODUCT

router.put("/:uid/:companyid/:rawmaterialid/:subrawmaterialid", async (req, res) => {

  const { uid, companyid, rawmaterialid, subrawmaterialid } = req.params
  const { updatedquantity } = req.body

  try{

    const existingsubmaterial = await submaterial.findOne({ userid: uid, company: companyid, rawmaterial: rawmaterialid, _id: subrawmaterialid })
    
    if (!existingsubmaterial) {
      return res.status(404).json({
      msg: "Submaterial doesn't exist"
    })
  }
  
  const updatesubmaterial = await submaterial.findOneAndUpdate({ userid: uid, company: companyid, rawmaterial: rawmaterialid, _id: subrawmaterialid }, {
    $inc: { quantity: updatedquantity }
  }, { new: true })

  if (updatesubmaterial) {
    return res.status(200).json({
      msg: "Quantity Updated successfully"
    })
  }
  else {
    return res.status(400).json({
      msg: "Update Failed"
    })
  }
}catch(e){
res.status(400).json({
  msg : "Error updating quantity"
})
}
})



router.get('/:uid/:companyid', async (req, res) => {
  const { uid, companyid } = req.params;

  try {
    // Find rawmaterial for the given company and populate submaterial details
    const getRawmaterial = await rawmaterial
      .find({ userid: uid, company: companyid })
      

    res.status(200).json(getRawmaterial);
  } catch (e) {
    res.status(400).json({
      msg: 'Error fetching Rawmaterial',
      error: e.message,
    });
  }
});


//Checking if catogory and item already exist in database or not 
router.get('/:uid/:companyid/:catogory/:item', async (req, res) => {
  const { uid, companyid, catogory, item } = req.params

  const rawmaterialname = catogory.toLowerCase()
  const submaterialname = item.toLowerCase()


  try {

    const existingrawmaterial = await rawmaterial.findOne({ userid: uid, company: companyid, catogory: {$regex : new RegExp(`^${rawmaterialname}$` ,'i')} })

    if (existingrawmaterial) {
      const rawmaterialId = existingrawmaterial._id

      const existingsubmaterial = await submaterial.findOne({ userid: uid, company: companyid, rawmaterial: rawmaterialId,   name: { $regex: new RegExp(`^${submaterialname}$`, 'i') } // case-insensitive match
    })
      
      if (existingsubmaterial) {
        const submaterialId = existingsubmaterial._id

        return res.status(200).json({
          submaterialId, rawmaterialId , existingsubmaterial
        })
      }
      else{
        return res.status(404).json({
          msg : "submaterial cannot be found"
        })
      }

    }
    else {
      return res.status(400).json({ msg: "Cannot fetch rawmaterial" })
    }



  } catch (e) {
   return  res.status(400).json({
      msg: "error fetching rawmaterials",
      error: e.message
    })
  }
})


//DELETE SUB MATERIAL AND DELETE RAW MATERIAL
router.delete("/:uid/:companyid/:rawmaterialid", async (req, res) => {


  const { uid, companyid, rawmaterialid } = req.params

  try {


    const DeleteRawmaterial = await rawmaterial.deleteOne({ userid: uid, company: companyid, _id: rawmaterialid })



    if (DeleteRawmaterial.deletedCount === 0) {
      return res.status(400).json({
        msg: "RAwmaterial was not deleted"
      })
    }

    await submaterial.deleteMany({
      rawmaterial: rawmaterialid,

    })
    return res.status(200).json({
      msg: "Rawmaterial Deleted"
    })

  } catch (e) {
    res.status(401)
  }
})


//Delete Submaterial only 

router.delete("/:uid/:companyid/:rawmaterialid/:submaterialid", async (req, res) => {

  const { uid, companyid, rawmaterialid, submaterialid } = req.params


  try {


    const Deletesubmaterial = await submaterial.deleteOne({ userid: uid, company: companyid, rawmaterial: rawmaterialid, _id: submaterialid })


    if (Deletesubmaterial.deletedCount === 0) {
      return res.status(400).json({
        msg: "Submaterial cannot be deleted"
      })
    }
    else {
      await rawmaterial.updateOne(
        { _id: rawmaterialid },
        { $pull: { submaterial: submaterialid } } // Remove submaterial ID from the array
      );


      res.status(200).json({

        msg: "Submaterial Deleted"
      })
    }
  } catch (e) {
    res.status(401).json({
      error: e.message
    })
  }


})



module.exports = router;