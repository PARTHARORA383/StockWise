

import { useState } from "react"
import { getAuth } from "firebase/auth"
import app from "./firebase_config"

import { GoogleAuthProvider  , signInWithPopup} from "firebase/auth";

import { FcGoogle } from "react-icons/fc";

const auth = getAuth(app)
const GoogleSign = ()=>{

  const [user , setUser] = useState(null)

const handleSignin =  async ()=>{

  const provider = new GoogleAuthProvider();

  const response = await signInWithPopup(auth , provider)
  const user = response.user
  const isNewUser =   response.additionalUserInfo?.isNewUser;

  if (isNewUser) {
    console.log("New user signed up:", user);
  } else {
    console.log("Existing user logged in:", user);
  }


  setUser(user)
}

  return <div>
    <button  className="text-xl border-2  rounded-xl w-2/3 h-12 border-gray-400 hover:bg-blue-500 hover:text-white" onClick={handleSignin}> <div className="flex justify-center items-center">

  
    <FcGoogle className= "w-8 h-8 m-2"/>
    <h2>Sign Up with Google</h2>
    </div>
     </button>


  </div>
}

export default GoogleSign