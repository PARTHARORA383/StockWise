
const express = require("express");

const {dbconnect} = require("./Models/db.js")
const config = require("./Authentication/Auth0.js")


require('dotenv').config()

const cors = require("cors"); 




const User = require('./Routes/User.js');
const CompanyRoutes = require('./Routes/Company.js');
const purchaseRoutes = require('./Routes/PurchaseRoute.js');
const RawMaterial = require('./Routes/Rawmaterial.js');
const ManufacturedProducts = require('./Routes/ManufucturedProducts.js')
const Sales = require('./Routes/Sales.js')
const verifyToken = require('./Middleware/Tokenverification.js');
const { auth } = require("express-openid-connect");
const app = express();
app.use(express.json());
app.use(cors());

app.use(auth(config))
console.log(config)
app.use(verifyToken)
console.log(verifyToken);

dbconnect();

app.use('/company' , CompanyRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/rawmaterial' , RawMaterial)
app.use('/ManufacturedProducts' , ManufacturedProducts)
app.use('/Sales' , Sales)
app.use('/auth' , User )
require('./Routes/rescheduler');



app.listen(3000 , ()=>{
  console.log('Application running on local host 3000')
})