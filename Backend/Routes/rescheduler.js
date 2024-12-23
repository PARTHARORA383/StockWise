 const express = require("express")
 const cron = require('node-cron')
const { Purchase} = require('../Models/Purchase')
const {Company} = require("../Models/Company")
const reschedulePurchase = async (company)=>{

const now = new Date();


if(now >= company.enddate){

  const purchases =  await Purchase.find({company : company._id  , archived : false})

  for(const purchase of purchases){

    purchase.archived = true 
    await purchase.save();

  }
}

}


cron.schedule("0 0 * * *" , async ()=>{
  const companies = await Company.find();

  console.log("Rescheduling task for companies purchase")

  for(const company of companies){
    await reschedulePurchase(company)

  }
})

