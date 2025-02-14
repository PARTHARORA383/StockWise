import React, { useEffect, useState } from 'react';
import app from "./firebase_config"
import { getAuth,    signInWithEmailAndPassword} from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useCompany } from '../Components/Companycontext';
import { useNavigate } from 'react-router-dom';

const auth = getAuth(app)




const Signincomponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showpassword, setShowpassword] = useState(false)
  const[userobj , setUserObj] = useState()
  const {uid , setUid  ,selectedCompany, setSelectedCompany } = useCompany()

  
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault();
    signin(email, password);
  };


  const togglepassword = () => {
    setShowpassword(!showpassword)
  }


  const signin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;


      console.log("User signed in:", user);
      
      const response =
        await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/auth/${user.uid}/Signin` )
       setUserObj(response.data.user)
       setSelectedCompany(response.data.user.companyid)
       localStorage.setItem("uid"  , JSON.stringify(user.uid))
       localStorage.setItem("token"  , JSON.stringify(user.accessToken))
   
      setUid(user.uid)
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };


  
  useEffect(()=>{

    if(selectedCompany && userobj){
      navigate(`/Dashboard/${userobj.uid}/${selectedCompany}`)
    }
   },[selectedCompany ,userobj , navigate])


  return (
    <div className='flex flex-col rounded-xl h-3/5 mt-20'>
      <h2 className='text-4xl text-center mt-7 text-bold m-1.5'>Sign In</h2>
      <h2 className='text-lg text-center text-gray-500'>Welcome to Billventory! Signin to get started</h2>
      <div className='flex flex-col mr-6 ml-6 mt-6'>
        <label className='text-xl m-1'>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className='rounded-lg border-2 h-12 px-3 py-5 text-lg'
        />
      </div>
      <div className='flex flex-col mr-6 ml-6 mt-6'>
        <label className='text-xl  m-1'>Password</label>
        <input
          type={`${showpassword ? "text" : "password"} `}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          className='rounded-lg border-2 h-12 px-3 py-5 text-lg'
        />
      </div>
      <button type="submit" className=" m-6 rounded-lg h-12 text-white text-xl hover:bg-teal-600 bg-teal-700  " onClick={handleSubmit}>Sign in</button>
    </div>
  );
};






export default Signincomponent