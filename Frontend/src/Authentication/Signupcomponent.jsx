import React, { useState } from 'react';
import app from "./firebase_config"
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const auth = getAuth(app)

                      
const Signupcomponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showpassword , setShowpassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(email, password);
  };


  const togglepassword = ()=>{
    setShowpassword(!showpassword)
  }


const signup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword( auth ,email, password);
    const user =   userCredential.user;


    console.log("User signed up:", user);


    //Creating user in Local database
    const response  = await axios.post('http://localhost:3000/auth/Signup' , {
      uid : user.uid ,
      email : user.email,
      
    } , {
      headers: { "Content-Type": "application/json" },
    })



  } catch (error) {
    console.error("Error signing up:", error.message);
  }
};

  return (
    <div className='flex flex-col bg-white rounded-xl h-3/5 mt-20'>
      <h2 className='text-4xl text-center mt-7 text-bold m-1.5'>Create Your Account</h2>
      <h2 className='text-lg text-center text-gray-500'>Welcome to Billventory! Signup to get started</h2>
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
        <button type="submit"  className = " m-6 rounded-lg h-12 text-white text-xl hover:bg-teal-600 bg-teal-700  "onClick={handleSubmit}>Sign Up</button>
    </div>
  );
};






export default Signupcomponent