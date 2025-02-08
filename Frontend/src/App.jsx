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
import Signup from './Pages/Signup';
import Registercompany from './Pages/RegisterComapany';
import { Outlet } from "react-router-dom";
import Signin from './Pages/Signin';
import AuthOnChange from './Authentication/AuthOnChange';
import Expenses from './Pages/Expense';
import Vendors from './Pages/Vendors';


function App() {
  return (
    <CompanyProvider> 

      <BrowserRouter>
      <AuthOnChange />
        <div className="flex h-screen">
          <div className="flex-grow overflow-y-auto">
            <Routes>
              <Route element={<WithSidebarLayout />}>
                <Route path="/Purchase/:uid/:companyid" element={<PurchaseList />} />
                <Route path="/Purchaseform/:uid/:companyid" element={<PurchaseForm />} />
                <Route path="/Dashboard/:uid/:companyid" element={<Dashboard />} />
                <Route path="/Inventory/:uid/:companyid" element={<Inventory />} />
                <Route path="/ProductForm/:uid/:companyid" element={<ProductForm />} />
                <Route path="/SalesForm/:uid/:companyid" element={<SalesForm />} />
                <Route path="/Sales/:uid/:companyid" element={<SalesList />} />
                <Route path="/Expenses/:uid/:companyid" element={<Expenses />} />
                <Route path="/Vendors/:uid/:companyid" element={<Vendors />} />
              </Route>

              <Route element={<WithoutSidebarLayout />}>
                <Route path="/Signup" element={<Signup />} />
                <Route path="/Signin" element={<Signin />} />
                <Route path="/getting_started/:uid" element={<Registercompany />} />
              </Route>
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </CompanyProvider>
  );
}


function WithSidebarLayout() {
  return (
    <div className="flex h-screen">
      <div className="w-34 fixed h-full">
        <SidebarWrapper />
      </div>
      <div className="ml-64 flex-grow overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}


function WithoutSidebarLayout() {
  return <Outlet />;
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
