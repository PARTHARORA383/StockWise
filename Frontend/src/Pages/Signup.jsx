import GoogleSign from "../Authentication/GoogleSign"
import Signupcomponent from "../Authentication/Signupcomponent"




const Signup = () => {

  return <div>

    <div className="grid grid-cols-5 bg-gray-100 h-screen">

      <div className="col-span-2 bg-white m-10 rounded-xl">
        <div className="">
        <Signupcomponent />
        </div>
        <div className="flex items-center my-6">
          <div className=" flex-grow border-t border-gray-500 ml-6"></div>
          <span className="ml-2 mr-2 text-lg">OR</span>
          <div className=" flex-grow border-t border-gray-500 mr-6"></div>
        </div>
        <div className="text-center"><GoogleSign/></div>

      </div>
      


      <div className="col-span-3 max-h-screen pl-20
       pt-6 pr-12 pb-6">

        <div className= "  bg-gradient-to-tr from-teal-600 to-teal-800 h-full p-5 rounded-xl ">

          <div className="text-white text-5xl mb-3 leading-normal text-center" >
            Integrated Billing, Inventory, and Sales Management for Manufacturers
          </div>
          <div className="text-gray-100 text-xl leading-normal text-center">
          Designed specifically for manufacturers, Billventory combines all your essential business processes in one platform. From managing sales orders to tracking inventory and generating invoices, Billventory provides a comprehensive solution that adapts to your unique needs. Whether you’re a small business or scaling up, Billventory is your go-to software for efficient business management
          </div>
        </div>
      </div>
    </div>

  </div>
}


export default Signup


