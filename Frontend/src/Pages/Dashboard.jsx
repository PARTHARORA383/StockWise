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


  return <div className="h-full bg-gray-100 ">

    <div className="sticky ml-4 z-20 border-b-2 top-0 bg-white h-14 text-supabaseGray-dark text-lg flex items-center justify-between">
      <div className=" ml-4 text-3xl text-supabaseGray-dark font-medium">StockWise</div>
    </div>

    <div className="m-6 ml-6 mr-10 flex items-center justify-between">
      <div>
        <h2 className="text-xl lg:text-2xl font-medium ml-4 mr-5">{"Hello, " + ownername + " !"}</h2>
        <div className="text-lg ml-4">Welcome to your Analysis Dashboard</div>
      </div>
      <div>
        <select 
          value={selectedrange} 
          onChange={(e) => setSelectedrange(e.target.value)} 
          className="bg-black h-10 text-sm lg:text-md text-white rounded-lg w-32 pl-2"
        >
          <option value="7">Last 7 Days</option>
          <option value="14">Last 14 Days</option>
          <option value="30">Last Month</option>
          <option value="180">Last 6 Months</option>
          <option value="365">Last Year</option>
        </select>
      </div>
    </div>

    <div className="ml-4 mr-5">
      <Totalpurchaseandsale purchase={true} sale={true} />
    </div>

    <div className="flex mr-5">
      <div className="lg:w-2/3 w-full rounded-lg bg-white m-3 ml-6">
        <PurchaseTrends />
      </div>

      <div className=" hidden lg:block lg:w-1/3 m-3 bg-gray-400 bg-opacity-10 rounded-lg">
        <h2 className="text-lg font-semibold mt-5 mr-3 ml-3">
          "Take the Stress Out of Finance - Our Software Makes Managing Your Money Simple and Efficient".
        </h2>

        <h2 className="text-lg mt-2 ml-4 mr-4">
          You can say goodbye to spreadsheets and paperwork our software is your all-in-one solutions for effortless financial management
        </h2>
      </div>
    </div>

  </div>
}

export default Dashboard;