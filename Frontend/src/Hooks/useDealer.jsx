import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCompany } from "../Components/Companycontext";

const Dealer = ()=>{

const [vendors , setVendors] = useState([])
const{vendor , setVendor} = useCompany();




const {companyid} = useParams()
const uid = JSON.parse(localStorage.getItem('uid'))

const handleFetchvendors = async ()=>{

  try{

    const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/vendor/${uid}/${companyid}`)
    setVendors(response.data.fetchVendors); 
  }catch(e){
    alert('error fetching vendors')
  }
}  

useEffect(()=>{
  handleFetchvendors()
},[companyid])
 

  return ( 
    <>
  
  <div className="w-full bg-gray-100 border-l-2 min-h-screen">
      <div className="flex justify-between">
        <div className="text-2xl  pt-6 pl-1.5 pb-2 font-semibold text-gray-800">Vendors</div>
      </div>

      <div className="h-1 bg-gradient-to-r from-teal-600 to-teal-800"></div>

      <div className="text-gray-900 text-lg w-full ">
        {vendors.map((item) => (
          <div className="bg-white shadow-md overflow-hidden" key={item._id}>
            <div className="bg-white text-black text-xl font-medium hover:bg-blue-300 hover:bg-opacity-30 border-b-2 border-opacity-50  p-4" onClick={()=>{
              setVendor(item)
            }}>
              {item.name}
            </div>

           
          </div>
        ))}
      </div>
    </div>
        </>
  )
       
}


export default Dealer;