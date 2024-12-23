import { faCartArrowDown, faChartLine, faGlobe, faHome, faPalette, faShoppingBag, faTag, faWarehouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCompany } from "./Companycontext";
import SelectCompany from "./SelectCompany";
import { createPortal } from "react-dom";

const Sidebar = ({ companyname }) => {


  const { selectedCompany , rendercompany , setRendercompany } = useCompany()
  
  console.log("This is companyname", companyname)
  const { companyid } = useParams()

  const navigate = useNavigate()

  const handlecompanyrender = ()=>{
    setRendercompany(true)
    console.log(rendercompany)
  }
  return <div className="">

    {
      rendercompany&& (

        createPortal(
          <SelectCompany/> , 
          document.body
          
        )
      )
    }
 
    
    <div className="w-72 min-h-screen bg-gray-200 text-black flex flex-col  items-center justify-start  border-r-2 border-gray-100">

      <div className="flex hover:cursor-pointer w-64 rounded-xl justify-start hover:bg-teal-700 hover:text-white p-4 mt-40" onClick={handlecompanyrender}>

        <div className="pl-3 text-xl">{companyname}</div> 

      </div>

      <div className="flex hover:cursor-pointer w-64 rounded-xl justify-start hover:bg-teal-700  hover:text-white p-4 mt-5 items-center" onClick={() => {
        navigate(`/Dashboard/${selectedCompany}`)
      }}>
        <FontAwesomeIcon icon={faHome} className="text-lg" />
        <div className="pl-3 text-xl"> Dashboard</div>
      </div>

      <div className="flex hover:cursor-pointer w-64 rounded-xl justify-start hover:bg-teal-700  hover:text-white p-4 items-center " onClick={() => {
        navigate(`/Purchase/${selectedCompany}`)
      }}>
        <FontAwesomeIcon icon={faCartArrowDown} className="text-lg pt-1" />
        <div className="pl-3 text-xl"> Purchase</div>
      </div>

      
      <div className="flex hover:cursor-pointer w-64 rounded-xl justify-start hover:bg-teal-700  hover:text-white p-4 items-center  " onClick={() => {
        navigate(`/Inventory/${selectedCompany}`)
      }}>
        <FontAwesomeIcon icon={faWarehouse} className="text-lg" />
        <div className="pl-3 text-xl"> Inventory</div>
      </div>

      <div className="flex hover:cursor-pointer w-64 rounded-xl justify-start hover:bg-teal-700  hover:text-white p-4 items-center  " onClick={() => {
        navigate(`/ProductForm/${selectedCompany}`)
      }}>
        <FontAwesomeIcon icon={faHome} className="text-lg" />
        <div className="pl-3 text-xl"> ProductForm</div>
      </div>
      <div className="flex hover:cursor-pointer w-64 rounded-xl justify-start hover:bg-teal-700  hover:text-white p-4  items-center" onClick={() => {
        navigate(`/Sales/${selectedCompany}`)
      }}>
        <FontAwesomeIcon icon={faHome} className="text-lg" />
        <div className="pl-3 text-xl"> Sales</div>
      </div>


    </div>


  </div>
}



export default Sidebar;