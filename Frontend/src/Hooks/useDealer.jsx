import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Dealer = ()=>{

  const [vendors , setVendors] = useState([])


const {companyid} = useParams()
const uid = JSON.parse(localStorage.getItem('uid'))

const handleFetchvendors = async ()=>{

  try{

    const response = await axios.get(`http://localhost/3000/vendor/${uid}/${companyid}`)
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
        <div className="text-xl p-6 pb-2 font-semibold text-gray-800">Vendors</div>
        <button
          type="button"
          className="px-5 me-2 mb-2 mt-2 text-md font-medium bg-gray-200 rounded-full"
          >
          Create
        </button>
      </div>

      <div className="h-1 bg-gradient-to-r from-blue-500 to-green-400"></div>

      <div className="text-gray-900 text-lg w-full">
        {vendors.map((item) => (
          <div className="bg-white shadow-md overflow-hidden" key={item._id}>
            <div className="bg-gradient-to-tr from-teal-800 to-teal-600 text-gray-200 text-xl font-medium p-4">
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