import React, { useEffect, useState } from 'react';
import app from "./firebase_config"
import { getAuth,    signInWithEmailAndPassword} from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useCompany } from '../Components/Companycontext';
import { useNavigate } from 'react-router-dom';
import ChartLoader from '../Components/loader';
const auth = getAuth(app)




const Signincomponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showpassword, setShowpassword] = useState(false)
  const [authError, setAuthError] = useState(null);
  const[userobj , setUserObj] = useState()
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;


      console.log("User signed in:", user);
      
      const response =
        await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/auth/${user.uid}/Signin` )

       setUserObj(response.data.user)
       setSelectedCompany(response.data.user.companyid)
       localStorage.setItem("uid"  , JSON.stringify(user.uid))
       localStorage.setItem("token"  , JSON.stringify(user.accessToken))

       if(response.status === 400){
        setAuthError(true);
       }
   
      setUid(user.uid)
    } catch (error) {
      setAuthError(true)
      console.error("Error signing up:", error.message);
    }
    finally{
      setLoading(false)
    }
  };


  
  useEffect(()=>{

    if(selectedCompany && userobj){
      navigate(`/Dashboard/${userobj.uid}/${selectedCompany}`)
    }
   },[selectedCompany ,userobj , navigate])


   if(loading){
    return <ChartLoader/>
   }


  return (
    
    <div className='flex flex-col rounded-xl h-3/5 mt-20'>
      <h2 className='text-3xl text-center mt-7 text-bold m-1.5'>Sign In</h2>
      <h2 className='text-lg text-center text-gray-500'>Welcome to Billventory! Signin to get started</h2>
      <div className='flex flex-col mr-6 ml-6 mt-6'>
        <label className='text-lg m-1'>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className={`rounded-lg border-2 h-11 px-3 py-5 text-lg ${
            authError ? 'border-red-500 focus:outline-red-500' : 'border-gray-200'
          }`}
        />
      </div>
      <div className='flex flex-col mr-6 ml-6 mt-6'>
        <label className='text-lg  m-1'>Password</label>
        <input
          type={`${showpassword ? "text" : "password"} `}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          className={`rounded-lg border-2 h-11 px-3 py-5 text-lg ${
            authError ? 'border-red-500 focus:outline-red-500' : 'border-gray-200'
          }`}
        />
        {authError && (
          <p className="text-red-500 text-sm mt-1">Invalid email or password</p>
        )}
      </div>
      <button type="submit" className=" m-6 rounded-lg h-11 text-white text-lg hover:bg-teal-600 bg-teal-700  " onClick={handleSubmit}>Sign in</button>
    </div>
  );
};






export default Signincomponent