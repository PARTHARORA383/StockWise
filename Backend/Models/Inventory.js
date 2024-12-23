
const mongoose = require('mongoose')


const Inventory  = new mongoose.Schema({

  Stock_category : {
    type : String , enum:["Rawmaterial , Product"]
  },
  Quantity : {type : String }
})

const inventory = mongoose.model("inventory" , Inventory)

module.exports ={
  inventory
}