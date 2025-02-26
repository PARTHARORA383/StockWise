

import { useEffect, useState } from "react"
import { getAuth } from "firebase/auth"
import app from "./firebase_config"

import { GoogleAuthProvider  , signInWithPopup} from "firebase/auth";

import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCompany } from "../Components/Companycontext";
import ChartLoader from "../Components/loader";


const auth = getAuth(app)
const GoogleSign = ()=>{

  const [isLoading , setIsLoading] = useState(false)
  const [userobj , setUserObj] = useState()
  const navigate = useNavigate()
  
  const { selectedCompany , setSelectedCompany} = useCompany()
const handleSignin =  async ()=>{
try{
  setIsLoading(true)      
  const provider = new GoogleAuthProvider();

  const response = await signInWithPopup(auth , provider)
  const user = response.user
  console.log(user.email)
  const isNewUser =   response.additionalUserInfo?.isNewUser;

  if (isNewUser) {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/auth/Signup`, {
      uid : user.uid ,
      email : user.email
    })

    if(response.status == 200){
    
      navigate(`/getting_started/${user.uid}`) 
      localStorage.setItem("uid"  , JSON.stringify(user.uid))
      localStorage.setItem("token"  , JSON.stringify(user.accessToken))
    }
  } else {

  const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/auth/${user.uid}/GoogleSignin` , {
  params : {
    email : user.email
  }
})
if(response.status == 201){
  localStorage.setItem("uid"  , JSON.stringify(user.uid))
  localStorage.setItem("token"  , JSON.stringify(user.accessToken))
  navigate(`/getting_started/${user.uid}`) 
}
else{

  setUserObj(response.data.user)
  setSelectedCompany(response.data.user.companyid)
  localStorage.setItem("uid"  , JSON.stringify(user.uid))
  localStorage.setItem("token"  , JSON.stringify(user.accessToken))
 
}
  }
}
catch(error){
  console.log(error)
}
finally{
  setIsLoading(false)
}
}


  useEffect(()=>{

    if(selectedCompany && userobj){
      navigate(`/Dashboard/${userobj.uid}/${selectedCompany}`)
    }
   },[selectedCompany ,userobj , navigate])


   if (isLoading) {
    return (
        <div className="flex justify-center items-center max-h-28">

      <ChartLoader/>
        </div>
  
    );
  }

  return <div>
    <button  className="text-lg border-2  rounded-xl w-2/3 h-11 border-gray-400 hover:bg-blue-500 hover:text-white" onClick={handleSignin}> <div className="flex justify-center items-center">

  
    <FcGoogle className= "w-7 h-7 m-2"/>
    <h2>Sign Up with Google</h2>
    </div>
     </button>


  </div>
}

export default GoogleSign