import { useState } from "react"

const Qoute = ()=>{

const [changepage , setChangePage] = useState(false)

setTimeout(() => {
  setChangePage(!changepage)
}, 7000);

return (
  <div className="bg-gradient-to-tr from-teal-600 to-teal-800 min-h-full p-5 rounded-xl ">
    {changepage ? (
      <>
        {/* Header Section */}
        <div className="text-white text-3xl mb-3 leading-normal text-center mt-14 transition-transform animate-fadeIn duration-700 ">
          Listing Expenses , Inventory, and Sales Management for Manufacturers
        </div>

        {/* Description Section */}
        <div className="text-gray-100 text-xl leading-normal text-center pl-6 pr-6 pb-6 pt-3 transition-transform animate-fadeIn duration-700">
          Designed specifically for manufacturers, StockWise combines all your essential business processes in one platform. From managing sales orders to tracking inventory  and listing sales, Stockwise provides a comprehensive solution that adapts to your unique needs.
        </div>

        {/* Image Section */}
        <div className="flex w-full justify-center items-center mt-10 transition-transform animate-fadeIn duration-700">
          <img
            src="/images/Qouteimage.jpg"
            alt="Signup Background"
            className="signup-image w-1/2 text-center rounded-lg"
          />
        </div>
      </>
    ) : (
<div className="w-full">

    <div className="text-white text-4xl mb-3 leading-tight text-center mt-14 transition-transform animate-fadeIn  text-bold duration-700 h-full ">
            Welcome Back ! 
        </div>

        {/* Description Section */}
        <div className="text-gray-100 text-2xl leading-tight text-center pl-6 pr-6 pb-6 pt-3 transition-transform animate-fadeIn duration-300 font-sans">
        "Empowering Manufacturers with Smarter Purchases and Inventory Solutions."

        </div>
       
            <div className="grid grid-cols-2  gap-4 m-4 mt-8 ">
              <div className=" p-6 col-span-1  rounded-lg "><img src="/images/inventory.jpg" className=" rounded-lg w-full transition-transform animate-fadeIn duration-700"/></div>
              <div className=" p-6
              col-span-1  rounded-lg"><img src="/images/invoice_3.jpg" className="rounded-lg transition-transform animate-fadeIn duration-700"/></div>
              
      
              
               </div>
      
</div>



    )}
  </div>
);






}


export default Qoute