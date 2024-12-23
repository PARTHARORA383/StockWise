const mongoose = require("mongoose");
require('dotenv').config();  // This should be at the very top of your file


const dbconnect = async ()=>{
  
await mongoose.connect(process.env.DATABASE_URL).then(()=>{
console.log("connected to mongodb");
});
}



module.exports={
dbconnect
} 