import { useEffect, useState } from 'react'
import PurchaseList from './Components/PurchaseList'
import { BrowserRouter , Routes , Route, useParams } from "react-router-dom";
import "./index.css"
import PurchaseForm from './Components/PurchaseForm';
import axios from 'axios';
import Sidebar from './Components/Sidebar';
import Dashboard from './Pages/Dashboard';
import { CompanyProvider, useCompany } from './Components/Companycontext';
import Inventory from './Pages/Inventory';
import ProductForm from './Components/ProductForm';
import SalesForm from './Components/SalesForm';
import SalesList from './Components/SalesList';
import SelectCompany from './Components/SelectCompany';


function App() {

  const[companyid , setCompanyid] = useState("");
  const {rendercompany , setRendercompany} = useCompany()

  return (
    <>
    <CompanyProvider>

    <BrowserRouter>
    
    <div className='flex h-screen'>
      <div className='w-34 fixed h-full '>
    <SidebarWrapper/>
      </div>
    <div className=' ml-64 flex-grow overflow-y-auto'>
    <Routes>
      <Route path = {`/Purchase/:companyid`} element ={<PurchaseList/>} />
      <Route path = "/Purchaseform/:companyid" element ={<PurchaseForm/>} />
      <Route path = "/Dashboard/:companyid" element ={<Dashboard/>} />
      <Route path = "/Inventory/:companyid" element ={<Inventory/>} />
      <Route path = "/ProductForm/:companyid" element ={<ProductForm/>} />
      <Route path = "/SalesForm/:companyid" element ={<SalesForm/>} />
      <Route path = "/Sales/:companyid" element ={<SalesList/>} />
    
    </Routes>
    </div>
    </div>
    </BrowserRouter>
    </CompanyProvider>
    </>
  )
}

function SidebarWrapper() {
  const { companyid } = useParams(); // Get companyid from the URL
  const [companyname, setCompanyname] = useState("");
   const{selectedCompany} = useCompany()
     useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/company/${selectedCompany}`);
        // setCompanyname(response.data.name); // Set the company name from the response
        setCompanyname(response.data.name)
        console.log(response.data.name)
      } catch (error) {
        console.error('Error fetching company name:', error);
      }
    };

  
      fetchCompany();
  
  }, []);

  return <Sidebar companyname ={companyname} />;
}

export default App
