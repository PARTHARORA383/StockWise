import { faCartArrowDown, faChartLine, faGlobe, faHome, faPalette, faShoppingBag, faTag, faWarehouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCompany } from "./Companycontext";
import Logout from "../Authentication/Logout";
import axios from "axios";

const Sidebar = () => {


  const { selectedCompany , rendercompany , setRendercompany  } = useCompany()
  const [companyname , setCompanyName] = useState("")

  const { companyid } = useParams()

  const navigate = useNavigate()
  const uid = JSON.parse(localStorage.getItem("uid"))


  const fetchCompany = async ()=>{
    const response = await axios.get(`http://localhost:3000/company/${uid}` )

    setCompanyName(response.data[0].name)
  }


  useEffect(()=>{
    fetchCompany()
  },[])
  
  return <div className="">
 

    
    <div className="w-72 min-h-screen bg-gray-200 text-black flex flex-col  items-center justify-start  border-r-2 border-gray-100">

      <div className="flex hover:cursor-pointer w-64 rounded-xl justify-start hover:bg-teal-700 hover:text-white p-4 mt-40" >
        <div className="pl-3 text-xl">{companyname}</div> 
      </div>

      <div className="flex hover:cursor-pointer w-64 rounded-xl justify-start hover:bg-teal-700  hover:text-white p-4 mt-5 items-center" onClick={() => {
        navigate(`/Dashboard/${uid}/${selectedCompany}`)
      }}>
        <FontAwesomeIcon icon={faHome} className="text-lg" />
        <div className="pl-3 text-xl"> Dashboard</div>
      </div>

      <div className="flex hover:cursor-pointer w-64 rounded-xl justify-start hover:bg-teal-700  hover:text-white p-4 items-center " onClick={() => {
        navigate(`/Purchase/${uid}/${selectedCompany}`)
      }}>
        <FontAwesomeIcon icon={faCartArrowDown} className="text-lg pt-1" />
        <div className="pl-3 text-xl"> Purchase</div>
      </div>

      
      <div className="flex hover:cursor-pointer w-64 rounded-xl justify-start hover:bg-teal-700  hover:text-white p-4 items-center  " onClick={() => {
        navigate(`/Inventory/${uid}/${selectedCompany}`)
      }}>
        <FontAwesomeIcon icon={faWarehouse} className="text-lg" />
        <div className="pl-3 text-xl"> Inventory</div>
      </div>

      <div className="flex hover:cursor-pointer w-64 rounded-xl justify-start hover:bg-teal-700  hover:text-white p-4 items-center  " onClick={() => {
        navigate(`/ProductForm/${uid}/${selectedCompany}`)
      }}>
        <FontAwesomeIcon icon={faHome} className="text-lg" />
        <div className="pl-3 text-xl"> ProductForm</div>
      </div>
      <div className="flex hover:cursor-pointer w-64 rounded-xl justify-start hover:bg-teal-700  hover:text-white p-4  items-center" onClick={() => {
        navigate(`/Sales/${uid}/${selectedCompany}`)
      }}>
        <FontAwesomeIcon icon={faHome} className="text-lg" />
        <div className="pl-3 text-xl"> Sales</div>
      </div>
      <div className="flex hover:cursor-pointer w-64 rounded-xl justify-start hover:bg-teal-700  hover:text-white p-4  items-center" onClick={() => {
        navigate(`/Expenses/${uid}/${selectedCompany}`)
      }}>
        <FontAwesomeIcon icon={faHome} className="text-lg" />
        <div className="pl-3 text-xl"> Expenses</div>
      </div>
      <div className="flex hover:cursor-pointer w-64 rounded-xl justify-start hover:bg-teal-700  hover:text-white p-4  items-center" >
        <FontAwesomeIcon icon={faHome} className="text-lg" />
        <div className="pl-3 text-xl"><Logout/></div>
      </div>


    </div>


  </div>
}



export default Sidebar;