const express = require("express")
const { rawmaterial, submaterial } = require('../Models/RawMaterial')
const router = express.Router();


//CREATING A RAW MATERIAL 
router.post("/:companyid", async (req, res) => {
  const companyid = req.params.companyid;
  const { catogory, subrawmaterial } = req.body;

  try {
    // Check if the raw material already exists for the company
    const alreadyexist = await rawmaterial.findOne({ catogory: catogory, company: companyid });

    if (!alreadyexist) {
      const newRawmaterial = new rawmaterial({
        catogory: catogory,
        company: companyid
      });

      // Save the raw material
      await newRawmaterial.save();

      const newSubmaterials = [];

      // Loop through the subrawmaterial array
      for (const sub of subrawmaterial) {
        // Check if the submaterial already exists
        let subrawmaterialsexist = await submaterial.findOne({ name: sub.name, rawmaterial: newRawmaterial._id });

        if (!subrawmaterialsexist) {
          // Create a new submaterial if it doesn't exist
          const submaterialnew = new submaterial({
            name: sub.name,
            quantity : sub.quantity,
            unit : sub.unit,
            rawmaterial: newRawmaterial._id,
            company: companyid

          });

          // Save the submaterial to the database
          await submaterialnew.save();

          // Add the submaterial to the newSubmaterials array
          newSubmaterials.push(submaterialnew._id);
        } else {
          newSubmaterials.push(subrawmaterialsexist._id)

        }
      }

      // Create the new raw material with submaterials
      newRawmaterial.submaterial = newSubmaterials
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

//UPDATE RAW MATERIAL TO ADD A NEW SUB MATERIAL 
router.put('/:companyid/:rawmaterialid', async (req, res) => {

  const { companyid, rawmaterialid } = req.params
  const { subrawmaterial } = req.body


  try {

      //Check if the rawmaterial exists or not
    const rawmaterialexist = await rawmaterial.findOne({ company: companyid, _id: rawmaterialid })


    if (!rawmaterialexist) {
      res.status(400).json({
        msg: "Raw material does not exist"
      })

    }

    //Loop through the inputs 
    for (const sub of subrawmaterial) {

      const subrawmaterialsexist = await submaterial.findOne({ rawmaterial: rawmaterialid, name: sub.name })

      if (!subrawmaterialsexist) {

        const updatesubmaterial = new submaterial({
          name: sub.name,
          quantity : sub.quantity,
          unit : sub.unit,
          rawmaterial: rawmaterialid,
          
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

router.put("/:companyid/:rawmaterialid/:subrawmaterialid" , async (req , res)=>{

  const {companyid , rawmaterialid , subrawmaterialid} = req.params
  const {updatedquantity}  = req.body

  const existingsubmaterial = await submaterial.findOne({ rawmaterial : rawmaterialid , _id : subrawmaterialid})

  if(!existingsubmaterial){
    return res.status(404).json({
      msg : "Submaterial doesn't exist"
    })
  }

  const updatesubmaterial = await submaterial.findOneAndUpdate({rawmaterial : rawmaterialid, _id : subrawmaterialid} ,{
     $inc :  {quantity : updatedquantity}
  } , {new : true})

  if(updatesubmaterial){
    return res.status(200).json({
      msg : "Quantity Updated successfully"
    })
  }
else{
  return res.status(400).json({
    msg : "Update Failed"
  })
}
})


router.get('/:companyid', async (req, res) => {
  const { companyid } = req.params;
  
  try {
    // Find rawmaterial for the given company and populate submaterial details
    const getRawmaterial = await rawmaterial
    .find({ company: companyid })
    .populate({
      path: 'submaterial', // Populate the 'submaterial' field
      model: 'submaterial', // Use the submaterial model to get submaterial data
    });
    
    res.status(200).json(getRawmaterial);
  } catch (e) {
    res.status(400).json({
      msg: 'Error fetching Rawmaterial',
      error: e.message,
    });
  }
});


//DELETE SUB MATERIAL AND DELETE RAW MATERIAL
router.delete("/:companyid/:rawmaterialid" , async (req , res)=>{


  const {companyid , rawmaterialid } = req.params

  try{

    
    const DeleteRawmaterial  = await rawmaterial.deleteOne({ _id : rawmaterialid} )
    
    
    
    if(DeleteRawmaterial.deletedCount === 0 ){
      return  res.status(400).json({
        msg : "RAwmaterial was not deleted"
      })
    }
    
      await submaterial.deleteMany({ rawmaterial : rawmaterialid ,
        
      })
    return   res.status(200).json({
        msg: "Rawmaterial Deleted"
      })

  }catch(e){
    res.status(401)
  }
})


router.delete("/:companyid/:rawmaterialid/:submaterialid" , async (req, res)=>{

  const {companyid , rawmaterialid ,submaterialid} = req.params


  try{

    
    const Deletesubmaterial = await submaterial.deleteOne({ rawmaterial : rawmaterialid , _id : submaterialid  })
  
    
    if( Deletesubmaterial.deletedCount === 0){
      return res.status(400).json({
        msg : "Submaterial cannot be deleted"
      })
    }
    else{
      await rawmaterial.updateOne(
        { _id: rawmaterialid },
        { $pull: { submaterial: submaterialid } } // Remove submaterial ID from the array
      );
  
      
    res.status(200).json({

      msg : "Submaterial Deleted" 
    })
  }
}catch(e){
  res.status(401).json({
    error : e.message
  })
}

  
})



module.exports = router;