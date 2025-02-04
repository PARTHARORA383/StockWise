
const express = require("express");

const {dbconnect} = require("./Models/db.js")


require('dotenv').config()

const cors = require("cors"); 




const User = require('./Routes/User.js');
const CompanyRoutes = require('./Routes/Company.js');
const purchaseRoutes = require('./Routes/PurchaseRoute.js');
const RawMaterial = require('./Routes/Rawmaterial.js');
const ManufacturedProducts = require('./Routes/ManufucturedProducts.js')
const Sales = require('./Routes/Sales.js')
const expense = require('./Routes/Expense.js')
const app = express();
app.use(express.json());
app.use(cors());


dbconnect();

app.use('/company' , CompanyRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/rawmaterial' , RawMaterial);
app.use('/ManufacturedProducts' , ManufacturedProducts);
app.use('/Sales' , Sales);
app.use('/auth' , User );
app.use('/Expense'  , expense);
require('./Routes/rescheduler');



app.listen(3000 , ()=>{
  console.log('Application running on local host 3000')
})