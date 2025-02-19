import GoogleSign from "../Authentication/GoogleSign"
import Signupcomponent from "../Authentication/Signupcomponent"
import { Link } from "react-router-dom"
import Qoute from "../Components/Qoute"




const Signup = () => {

  return <div>

    <div className="grid grid-cols-5 bg-gray-100 h-screen">

      <div className="lg:col-span-2 col-span-5 bg-white m-10 rounded-xl">
        <div className="">
          <Signupcomponent />
        </div>
        <div className="flex items-center my-6">
          <div className=" flex-grow border-t border-gray-500 ml-6"></div>
          <span className="ml-2 mr-2 text-lg">OR</span>
          <div className=" flex-grow border-t border-gray-500 mr-6"></div>
        </div>
        <div className="text-center"><GoogleSign /></div>
        <div className="text-center m-6 text-xl text-gray-700
                  ">Already have an account ? <Link to={"/Signin"} className=" hover:underline text-black">Signin</Link> </div>
      </div>



      <div className="hidden lg:block col-span-3 h-screen pl-20
       pt-6 pr-12 pb-6">

       <Qoute/>
      </div>
    </div>

  </div>
}


export default Signup


