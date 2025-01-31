import { Link } from "react-router-dom"
import GoogleSign from "../Authentication/GoogleSign"
import Signincomponent from "../Authentication/Signincomponent"
import Qoute from "../Components/Qoute"




const Signin = () => {

  return <div>

    <div className="grid grid-cols-5 bg-gray-100 h-screen">

      <div className="col-span-2 bg-white m-10 rounded-xl">
        <div className="">
        <Signincomponent />
        </div>
        <div className="flex items-center my-6">
          <div className=" flex-grow border-t border-gray-500 ml-6"></div>
          <span className="ml-2 mr-2 text-lg">OR</span>
          <div className=" flex-grow border-t border-gray-500 mr-6"></div>
        </div>
        <div className="text-center"><GoogleSign/></div>
        <div className="text-center m-6 text-xl text-gray-700
        ">Don't have an account ? <Link to ={"/Signup"} className=" hover:underline text-black">Signup</Link> </div>

      </div>
      


      <div className="col-span-3 max-h-screen pl-20
       pt-10 pr-12 pb-10">

       <Qoute/>
      </div>
    </div>

  </div>
}


export default Signin

