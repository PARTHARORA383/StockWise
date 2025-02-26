import { faCartArrowDown, faChartLine, faGlobe, faHome, faPalette, faShoppingBag, faTag, faWarehouse, faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCompany } from "./Companycontext";
import Logout from "../Authentication/Logout";
import axios from "axios";

const Sidebar = () => {
  const { selectedCompany, rendercompany, setRendercompany } = useCompany()
  const [companyname, setCompanyName] = useState("")
  const [showSidebar, setShowSidebar] = useState(false)

  const { companyid } = useParams()
  const navigate = useNavigate()
  const uid = JSON.parse(localStorage.getItem("uid"))

  const fetchCompany = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/company/${uid}`)
    setCompanyName(response.data[0].name)
  }

  useEffect(() => {
    fetchCompany()
  }, [])

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  return (
    <>
      {/* Mobile Menu Button - Only visible on small screens */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 text-white bg-supabaseGray p-2 rounded-md"
        onClick={toggleSidebar}
      >
        <FontAwesomeIcon icon={faBars} className="text-md" />
      </button>

      {/* Sidebar */}
      <div className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static transition-transform duration-300 ease-in-out z-40`}>
        <div className="max-w-lg  h-screen max-h-screen bg-supabaseGray text-white flex flex-col items-center justify-start border-r-2 border-gray-100 pl-1 pr-1">
          <div className="flex hover:cursor-pointer w-60 rounded-xl justify-start hover:bg-teal-700 hover:text-white p-4 mt-4 border-b-2 border-gray-100" >
            <div className="pl-3 text-md">{companyname}</div> 
          </div>

          <div className="flex hover:cursor-pointer w-60 rounded-xl justify-start hover:bg-teal-700 hover:text-white p-4 mt-10 items-center" 
            onClick={() => {
              navigate(`/Dashboard/${uid}/${selectedCompany}`)
              setShowSidebar(false)
            }}>
            <FontAwesomeIcon icon={faHome} className="text-md" />
            <div className="pl-3 text-md">Dashboard</div>
          </div>

          <div className="flex hover:cursor-pointer w-60 rounded-xl justify-start hover:bg-teal-700 hover:text-white p-4 items-center" 
            onClick={() => {
              navigate(`/Purchase/${uid}/${selectedCompany}`)
              setShowSidebar(false)
            }}>
            <FontAwesomeIcon icon={faCartArrowDown} className="text-md pt-1" />
            <div className="pl-3 text-md">Purchase</div>
          </div>

          <div className="flex hover:cursor-pointer w-60 rounded-xl justify-start hover:bg-teal-700 hover:text-white p-4 items-center" 
            onClick={() => {
              navigate(`/Inventory/${uid}/${selectedCompany}`)
              setShowSidebar(false)
            }}>
            <FontAwesomeIcon icon={faWarehouse} className="text-md" />
            <div className="pl-3 text-md">Inventory</div>
          </div>

         
          <div className="flex hover:cursor-pointer w-60 rounded-xl justify-start hover:bg-teal-700 hover:text-white p-4 items-center" 
            onClick={() => {
              navigate(`/Sales/${uid}/${selectedCompany}`)
              setShowSidebar(false)
            }}>
            <FontAwesomeIcon icon={faHome} className="text-md" />
            <div className="pl-3 text-md">Sales</div>
          </div>

          <div className="flex hover:cursor-pointer w-60 rounded-xl justify-start hover:bg-teal-700 hover:text-white p-4 items-center" 
            onClick={() => {
              navigate(`/Expenses/${uid}/${selectedCompany}`)
              setShowSidebar(false)
            }}>
            <FontAwesomeIcon icon={faHome} className="text-md" />
            <div className="pl-3 text-md">Expenses</div>
          </div>

          <div className="flex hover:cursor-pointer w-60 rounded-xl justify-start hover:bg-teal-700 hover:text-white p-4 items-center" 
            onClick={() => {
              navigate(`/Vendors/${uid}/${selectedCompany}`)
              setShowSidebar(false)
            }}>
            <FontAwesomeIcon icon={faHome} className="text-md" />
            <div className="pl-3 text-md">Vendors</div>
          </div>

          <div className="flex hover:cursor-pointer w-60 rounded-xl justify-start hover:bg-teal-700 hover:text-white p-4 items-center">
            <FontAwesomeIcon icon={faHome} className="text-md" />
            <div className="pl-3 text-md"><Logout/></div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {showSidebar && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </>
  )
}

export default Sidebar;