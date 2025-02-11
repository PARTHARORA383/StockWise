

import { useNavigate } from "react-router-dom"
import app  from "./firebase_config"
import { getAuth ,signOut } from "firebase/auth"
import { useState } from "react"
import { createPortal } from "react-dom"


const auth = getAuth(app)


const Logout =()=>{

const [confirmationbox , setcomfirmationbox] = useState()
const navigate = useNavigate()

const signout = async ()=>{
 
  await signOut(auth)
  localStorage.removeItem("uid")
  localStorage.removeItem("selectedCompany")
  localStorage.removeItem("token")

  
  navigate('/Signin')
}


const handleconfirm = ()=>{
  signout()
}
  
const handlecancel = ()=>{
  setcomfirmationbox(false)
}


const confirmation = ()=>{
  
 return createPortal(
  <div className="absolute z-50 inset-0 h-screen w-full flex justify-center items-center bg-black bg-opacity-50 transition duration-300 ease-in-out" 
     tabIndex="0" >
    <div className=" text-center bg-white p-5 rounded-lg shadow-lg w-96" >
      <h2 className="text-xl mb-4">Are you sure you want to Logout?</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:opacity-90"
        onClick={handleconfirm}
   

        >
        Yes
      </button>
      <button
        className="bg-blue-500 hover:opacity-90 text-white px-4 py-2 rounded mr-2"
        onClick={handlecancel}
        >
        No
      </button>


    </div>
  </div> ,
  document.body
)
}

  return <div>
  <button className="text-black hover:text-white text-xl " onClick={()=>{setcomfirmationbox(true)}}>    Log Out</button>
  {confirmationbox && confirmation()}
  </div>
}


export default Logout