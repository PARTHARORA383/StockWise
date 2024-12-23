const express = require("express");
const { Company } = require('../Models/Company')
const router = express.Router();

//Request for Creating , updating , Deleting and accessing the company list

router.post('/', async (req, res) => {

  try {

    const company = await Company.findById({
      _id: req.body.id
    })

    if (!company) {
      const new_company = new Company({
        _id: req.body.id,
        name: req.body.name,
        owner : req.body.owner,
        address: {
          country: req.body.address.country || "Unknown", // Default for country
          state: req.body.address.state,
          local: req.body.address.local || ""
        } ,
        startdate : req.body.startdate ,
        enddate : req.body.enddate
      })

      await new_company.save();

      console.log("company created")
      res.status(201).json({
        msg: "Company created"

      })
    }
    else {
        return res.status(409).json({
        msg: "Company already exists"
      })
    }
  } catch (e) {
    res.status(400).json("Invalid company ")
    console.log(e.message)
  }
}).get("/", async (req, res) => {

  try {
    const companylist = await Company.find();
    res.status(200).json(companylist);
  }
  catch (e) {
    res.status(400).json({
      msg: "There was an error fetching the companies",
      error: e.message
    })
  }

}).put("/:companyid" , async (req , res)=>{

  const companyid = req.params.companyid;
  const updates = req.body ;

try{

  const updateddetails =await  Company.findByIdAndUpdate(companyid , updates ,{
    new: true, // Return the updated document
    runValidators: true 
  }
  
)
if(!updateddetails){
  res.status(404).json({
    msg : "Company doesn't exist"
  })
}
else{
  res.status(200).json({
    msg : "updated" ,
    updateddetails
  })
}
}catch(e){
 res.status(400).json({
  msg:"Cannot update details",
  error : e.message
 })
}

})

router.get("/:companyid" , async(req , res)=>{

  const {companyid} = req.params;

  try{
    const company = await Company.findOne({_id : companyid})
     return res.status(200).json(company);
  }catch(e){

    res.status(400).json({
      msg : 'company not found'
    })
      
  }
})

router.delete("/:companyid" , async (req, res)=>{
  const {companyid} = req.params;

  try{
    const company = await Company.deleteOne({_id : companyid})

    if(company.deletedCount === 0){
      return res.status(401).json({
        msg : "Company not found"
      })
    }
    res.status(200).json({
      msg : "Company Deleted"
    })

  }catch(e){
    res.status(409).json({
      msg : 'cannot delete company',
      error : e.message
    })
  }
})


module.exports = router;