
import axios from "axios";
import ProductForm from "../Components/ProductForm";
import PurchaseTrends from "../Components/PurchaseTrends";
import { useEffect, useState } from "react";
import { useCompany } from "../Components/Companycontext";
import Totalpurchaseandsale from "../Components/TotalPurchaseandSale";
import { useParams } from "react-router-dom";


const Dashboard = () => {

  const [ownername, setOwnername] = useState("")
  const { selectedCompany, selectedrange, setSelectedrange, totalPurchaseAmount, totalSaleAmount  } = useCompany()
  const uid = JSON.parse(localStorage.getItem("uid"))

  useEffect(() => {

    const FetchCompany = async () => {

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/company/${uid}/${selectedCompany}`)
      setOwnername(response.data.owner)

    }

    FetchCompany()
  }, [])





  return <div className="h-full bg-gray-100  ml-8 ">

<div className=" sticky z-20 border-b-2 top-0 bg-white h-16 text-supabaseGray-dark text-2xl flex items-center justify-between">
        <div className="w-1/4 ml-5 text-3xl text-supabaseGray-dark font-medium">StockWise</div>
 
      </div>

    <div className="m-10 ml-10 mr-16  flex  items-center justify-between">
      <div>

        <h2 className="text-3xl font-medium ml-6 mr-8 "> {"Hello, " + ownername + " !"}</h2>
        <div className="text-lg ml-6"> Welcome to your Analysis Dashboard</div>
      </div>
      <div>
        <select value={selectedrange} onChange={(e) => setSelectedrange(e.target.value)} className="bg-black h-12  text-lg text-white rounded-xl w-44 pl-3 ">
          <option value="7">Last 7 Days</option>
          <option value="14">Last 14 Days</option>
          <option value="30">Last Month</option>
          <option value="180">Last 6 Months</option>
          <option value="365">Last Year</option>
        </select>

      </div>
    </div>


    <div className=" ml-6 mr-8 ">
      <Totalpurchaseandsale purchase={true} sale={true} />
    </div>


    <div className=" flex mr-8">

      <div className="lg:w-2/3 w-full  rounded-xl bg-white m-5 ml-10 ">
        <PurchaseTrends />
      </div>

      <div className="lg:w-1/3 m-5 bg-gray-400 bg-opacity-10 rounded-xl ">
        <h2 className="text-xl font-semibold mt-7 mr-4 ml-4"> "Take the Stress Out of Finance  Our Software Makes Managing Your Money Simple and Efficient".

        </h2>

        <h2 className="text-lg mt-2 ml-5 mr-5 ">You can say goodbye to spreadsheets and paperwork our software is your all-in-one solutions for effortless financial management</h2>

      </div>
    </div>


  </div>


}


export default Dashboard;