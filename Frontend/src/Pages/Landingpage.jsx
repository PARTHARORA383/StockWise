import { faCheck, faClock, faIndianRupeeSign} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useNavigate } from "react-router-dom";
import Dashboardpic from "../images/Dashboardpic.png";
import Purchases from "../images/Purchases.png"
import SalesForm from "../images/SalesForm.png"
import Sales from "../images/Sales.png"
import Vendors from "../images/Vendors.png";

const StockWiseLanding = () => {
  
  const navigate = useNavigate();



  return (
    <div className="bg-supabaseGray  flex flex-col items-center justify-center">
      {/* Left Section */}
      { 
        // Navbar
      }

    

      
        <div className=" z-50 fixed top-0 w-full left-0 right-0 bg-supabaseGray-dark   shadow-md border-b-2 border-opacity-30 ">
        <div className="max-w-8xl mx-auto ">
          <div className="flex justify-between items-center h-16 w-full ">

            <div className=" ml-5" onClick={()=>{
                navigate('/')
              }}>

              <span className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-200 mr-10" >StockWise</span>
            </div>
       

       
            <div className="hidden md:flex items-center space-x-4 mr-5">
              <button className="px-4 py-2 text-gray-600 hover:text-teal-600" onClick={
                ()=>{

                  navigate('/Signin')
                }
              }>
                Login
              </button>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
               onClick={()=>{
                 navigate('/Signup')
                }
               }>
                Get Started
              </button>
            </div>

 
          </div>

        </div>
      </div>
           
      { /* Section 1*/}
      <section className="w-full  px-10 py-20  text-white mt-24">
        <h1 className="text-7xl font-bold leading-tight">
          
          Transform Your <br /> <span className="text-teal-600">Inventory Management</span>
        </h1>
        <p className="text-2xl mt-4 opacity-70">
          Streamline operations, reduce costs, and gain real-time insights 
          with our powerful <br/> yet intuitive inventory management solution.
        </p>
        <div className="mt-6 flex gap-4" onClick={()=>{
          navigate('/Signup')
        }}>
          <button className="px-6 py-3 bg-white text-teal-800 font-semibold rounded-lg hover:bg-gray-200">
            Get Started
          </button>
       
        </div>
        {/* Stats */}
        <div className="mt-10 flex justify-between items-center  bg-gray-100 rounded-lg p-3 bg-opacity-10">
          <div>
            <h3 className="text-3xl font-bold">99.9%</h3>
            <p className="text-sm text-gray-200">Accuracy Rate</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">23%</h3>
            <p className="text-sm text-gray-200">Cost Reduction</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">10+</h3>
            <p className="text-sm text-gray-200">Active Users</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">24/7</h3>
            <p className="text-sm text-gray-200">Support Available</p>
          </div>
        </div>
      </section>



      {/* Section 2 */}

      <div>

      </div>
      {/* Section 3 Why choose us? */}

      <div className="w-full  mt-5 bg-supabaseGray-dark"> 
        <div className=" flex flex-col gap-2">

        <div className="text-4xl text-white text-center font-bold mt-10"> Why Choose Our Inventory Management Solution 
        </div>
        <div className="text-gray-200 text-lg text-center">
        Discover how our platform transforms your inventory operations and provides tangible business<br/> benefits.
        </div>
        </div>
          

      <div className="grid grid-cols-1 lg:grid-cols-2 ml-4 lg:ml-8 ">
            
      <div className="flex flex-col gap-6">
    <div className="text-gray-100 text-2xl font-medium mt-16">Maximize Efficiency and Reduce Manual Management</div>

    <div className="flex gap-4">
      <div className="rounded h-8 w-8 text-white bg-teal-500 flex items-center  justify-center">
      <FontAwesomeIcon icon={faIndianRupeeSign}/>
      </div>
      <div className=" flex flex-col gap-4">
        <div className=" text-xl text-gray-100">Reduce Carrying Costs</div>
        <div className=" text-md text-gray-100">Reduce your costs buy providing clear view of your expenses and profits.<br/> Giving you the perfect software for inventory</div>
      </div>

    </div>
    <div className="flex gap-4">
      <div className="rounded h-8 w-8 text-white bg-teal-500 flex items-center  justify-center">
      <FontAwesomeIcon icon={faClock}/>
      </div>
      <div className=" flex flex-col gap-4">
        <div className=" text-xl text-gray-100">Saves Time </div>
        <div className=" text-md text-gray-100">Reduce your time by effectively mapping your expenses and sales.<br/> Making your inventory manegement smooth</div>
      </div>

    </div>
    <div className="flex gap-4">
      <div className="rounded h-8 w-8 text-white bg-teal-500 flex items-center  justify-center">
      <FontAwesomeIcon icon={faClock}/>
      </div>
      <div className=" flex flex-col gap-4">
        <div className=" text-xl text-gray-100">Reduce Manual Efforts</div>
        <div className=" text-md text-gray-100">Reduce your Manual effort of maintaining ledger accounts <br/> Offers clean and simple inventory for handling stock</div>
      </div>

    </div>

      </div>
        
        { /* Dashboard image */}

        <div>
          <div className="bg-gradient-to-r from-teal-700 to-teal-800 rounded-lg bg-opacity-20 p-4 mt-20 mr-4 hover:scale-105 duration-300 transition-transform hover:bg-gradient-to-l cursor-pointer">
              <img src = {Dashboardpic} />
          </div>
        </div>
      </div>

      <div className="w-full bg-supabaseGray-dark p-10 mt-20 ">
     
     
      <div className="relative bg-gradient-to-r from-purple-700 to-indigo-700 text-white py-10 px-4 rounded-2xl">
      {/* Clipped Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 clip-diagonal rounded-xl"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <h2 className="text-xl md:text-3xl font-bold">
          Ready to transform your inventory management?
        </h2>
        <p className="mt-4 text-lg">
          Join us in our mission to making stock manegement as easy as plucking a flower.
        </p>
        <button className="mt-6 bg-white text-purple-700 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition hover:scale-105 transition transform duration-300" onClick={()=>{
          navigate("/Signup")
        }}>
          Get Started Today
        </button>
      </div>
    </div>
      </div>
      
   


      </div>

      {/* power section */}
      <div className="mt-8 ">


      <div className="text-4xl text-white text-center font-bold mt-10"> A Powerful solution for manufactures 
</div>
  <div className="text-gray-200 text-lg text-center">
  Our inventory management solution is designed for the unique needs of  manufacturing industries. See how it can transform <br/> your operations.
</div>


      <div className=" flex flex-col lg:flex-row lg:justify-between lg:items-center mt-16">
        <div className="lg:w-1/2 ml-5">

        <div className="flex gap-4">
      <div className="rounded-full h-8 w-8 text-white bg-teal-500 flex items-center  justify-center">
      <FontAwesomeIcon icon={faCheck}/>
      </div>

      <div className=" flex flex-col gap-3">
        <div className=" text-xl text-gray-100">Raw Material Management</div>
        <div className=" text-md text-gray-100">Track components and raw materials through the <br/>production process with precision.</div>
      </div>
    </div>


        <div className="flex gap-4 mt-5">
      <div className="rounded-full h-8 w-8 text-white bg-teal-500 flex items-center  justify-center">
      <FontAwesomeIcon icon={faCheck}/>
      </div>

      <div className=" flex flex-col gap-3">
        <div className=" text-xl text-gray-100">Simple Sales Management</div>
        <div className=" text-md text-gray-100">List your daily sales with just a simple form<br/>keeping track of all your products
        </div>
      </div>

    </div>
        <div className="flex gap-4 mt-5">
      <div className="rounded-full h-8 w-8 text-white bg-teal-500 flex items-center  justify-center">
      <FontAwesomeIcon icon={faCheck}/>
      </div>

      <div className=" flex flex-col gap-4">
        <div className=" text-xl text-gray-100">Expense Listing</div>
        <div className=" text-md text-gray-100">Also list your daily expenses  with just some clicks <br/> keeping a track of your total purchases</div>
      </div>

    </div>
        </div>

        <div className="lg:w-1/2 mt-5 ml-5 lg:mt-0 lg-ml-0">
        <div className="grid grid-cols-2 bg-teal-500 bg-opacity-30 p-5 gap-4 rounded-xl cursor-pointer mr-10">
        <div className="">
          <img src = {Purchases}/>
        </div>
        <div className="">
          <img src = {SalesForm}/>
        </div>
        <div className="">
          <img src = {Vendors}/>
        </div>
        <div className="">
          <img src = {Sales}/>
        </div>
  
        </div>
        </div>
      </div>

</div>

{/* Footer */}

<div className=" flex justify-between items-center bg-supabaseGray-dark w-full mt-10">
  
  <div className="flex flex-col mt-10 ml-5 mb-10">

    <div className = "text-2xl  font-bold text-teal-600 mb-6"> Stockwise</div>
    <div className = "text-md text-gray-200"> Transforming inventory management with intelligent solutions <br/> that help businesses optimize <br/>operations and drive growth.</div>
  
  </div>

  <div className="flex gap-5 text-white mr-10 ">
    <div  className="hover:scale-105 transition-transform duration-300 cursor-pointer " 
     onClick={() => window.open('https://github.com/PARTHARORA383', '_blank')}
    >
    <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path
      fillRule="evenodd"
      d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.385.6.111.793-.261.793-.578v-2.169c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.204.085 1.837 1.237 1.837 1.237 1.07 1.835 2.807 1.305 3.492.997.108-.776.419-1.305.762-1.605-2.666-.305-5.466-1.333-5.466-5.931 0-1.312.469-2.385 1.236-3.224-.123-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.302 1.23a11.499 11.499 0 0 1 6.006 0c2.294-1.552 3.302-1.23 3.302-1.23.653 1.652.24 2.873.117 3.176.768.839 1.236 1.912 1.236 3.224 0 4.61-2.803 5.624-5.478 5.921.43.372.813 1.102.813 2.222v3.293c0 .319.192.694.8.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12Z"
      clipRule="evenodd"
    />
  </svg>
    </div>
<div className="hover:scale-105 transition-transform duration-300 cursor-pointer " 
     onClick={() => window.open('https://x.com/partharora9128', '_blank')}>
<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775A4.935 4.935 0 0 0 23.337 3a9.865 9.865 0 0 1-3.127 1.184 4.922 4.922 0 0 0-8.384 4.482C7.691 8.456 4.066 6.468 1.64 3.162a4.916 4.916 0 0 0-.665 2.475c0 1.71.87 3.214 2.188 4.096a4.902 4.902 0 0 1-2.228-.616v.06c0 2.385 1.698 4.374 3.946 4.828a4.904 4.904 0 0 1-2.224.085c.626 1.956 2.444 3.377 4.6 3.417a9.868 9.868 0 0 1-6.115 2.105c-.397 0-.79-.023-1.175-.068A13.936 13.936 0 0 0 7.548 21c9.142 0 14.307-7.721 14.307-14.417 0-.22-.005-.437-.015-.653A10.243 10.243 0 0 0 24 4.557z" />
  </svg>
</div>
<div className="hover:scale-105 transition-transform duration-300 cursor-pointer " 
     onClick={() => window.open('https://www.linkedin.com/in/parth-arora-bbb747235/', '_blank')}>
<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path d="M22.225 0H1.771C.792 0 0 .774 0 1.727v20.545C0 23.226.792 24 1.771 24h20.454C23.205 24 24 23.226 24 22.273V1.727C24 .774 23.205 0 22.225 0zM7.12 20.454H3.56V9h3.56v11.454zM5.34 7.5a2.067 2.067 0 1 1 0-4.134 2.067 2.067 0 0 1 0 4.134zM20.453 20.454h-3.56v-5.591c0-1.334-.024-3.05-1.86-3.05-1.86 0-2.144 1.455-2.144 2.96v5.682h-3.56V9h3.42v1.56h.048c.477-.9 1.638-1.86 3.37-1.86 3.606 0 4.275 2.37 4.275 5.455v6.299z" />
  </svg>
</div>
  </div>
</div>
  
    </div>
  );
};

export default StockWiseLanding;
