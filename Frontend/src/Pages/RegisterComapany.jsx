import { useState } from "react"
import SelectCompany from "../Components/SelectCompany"
import UseRegister from "../Hooks/UseRegister"
import { useCompany } from "../Components/Companycontext"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

const Registercompany = () => {

 const {selectedCompany , setSelectedCompany } = useCompany()
  const navigate = useNavigate()
  const [companyname , setCompanyname] = useState("")
  const [companyid , setCompanyid] = useState("")
  const {uid} = useParams()

  const handlesubmit = async ()=>{

    const requestbody = {
      userid : uid,
      id: companyid,
      name: companyname,
    }
    console.log("uid id" + uid)

    const response = await axios.post(`http://localhost:3000/company/${uid} `, requestbody,
      {
          headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.status == 201){    
     setSelectedCompany(companyid)


     const response1 = await axios.put(`http://localhost:3000/auth/${uid}/Signup` ,
      {
        companyid : companyid
      }
      , 
      {
        headers : {
          "Content-Type" : "application/json"
        }
      }
     )

    
     setTimeout(() => {
      navigate(`/Dashboard/${uid}/${selectedCompany}`)
     }, 1000);
    
    }
  }
  

  return <div className="grid grid-cols-5 bg-gray-100 h-screen">

      <div className="col-span-2 bg-white m-6 rounded-xl">
        <div className="text-4xl text-bold mt-24 mb-2 text-center   ">Register Your Company</div>
        <div className="text-lg  text-center text-gray-500" >Create your company and get started with Billventory</div>
        <div className="p-5">
          <div className="flex flex-col mr-6 ml-6 mt-6 ">
          <label className="text-lg m-1">Firm Name</label>
          <input className="text-lg px-3 py-5 h-12 border-2 rounded-lg " type = "text" value = {companyname}
          placeholder="Enter your Firm name"
          onChange={(e)=>{
            setCompanyname(e.target.value)
          }}/>
          </div>
          <div className="flex flex-col mr-6 ml-6 mt-6 ">
          <label className="text-lg m-1">GSTIN</label>
          <input className="text-lg px-3 py-5 h-12 border-2 rounded-lg   " type = "text" value = {companyid}
          placeholder="Enter your GSTIN "
          onChange={(e)=>{
            setCompanyid(e.target.value)
          }}/>
          </div>
        </div>
          <div className="  text-normal text-red-500 mr-6 ml-12 ">Note : If you dont want to enter the GST invoice number . Kindly fill a number you can remember</div>
          <div className="flex w-full justify-center mt-4">

          <button className="bg-blue-600  h-12 text-white rounded-xl hover:bg-blue-500 w-60  " onClick={handlesubmit}>Finish</button>
          </div>
      </div>

        






      <div className="col-span-3 max-h-screen pl-20
 pt-6 pr-12 pb-6">

        <div className="  bg-gradient-to-tr from-teal-600 to-teal-800 h-full p-5 rounded-xl ">

          <div className="text-white text-5xl mb-3 leading-normal text-center" >
            Integrated Billing, Inventory, and Sales Management for Manufacturers
          </div>
          <div className="text-gray-100 text-xl leading-normal text-center">
            Designed specifically for manufacturers, Billventory combines all your essential business processes in one platform. From managing sales orders to tracking inventory and generating invoices, Billventory provides a comprehensive solution that adapts to your unique needs. Whether you’re a small business or scaling up, Billventory is your go-to software for efficient business management
          </div>
        </div>
      </div>
    </div>
}


export default Registercompany