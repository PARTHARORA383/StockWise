import axios from "axios";
import ProductForm from "../Components/ProductForm";
import PurchaseTrends from "../Components/PurchaseTrends";
import { useEffect, useState } from "react";
import { useCompany } from "../Components/Companycontext";
import Totalpurchaseandsale from "../Components/TotalPurchaseandSale";
import { useParams } from "react-router-dom";
import PieChart from "../Components/PieChart";

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

    <div className="sticky  z-20 border-b-2 top-0 bg-white h-14 text-supabaseGray-dark text-lg flex items-center justify-between">
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

    <div className="lg:ml-4 lg:mr-5 m-3">
      <Totalpurchaseandsale purchase={true} sale={true} />
    </div>

    <div className="flex lg:mr-5 lg:h-96 min-h-96 m-3">
      <div className="lg:w-2/3 w-full rounded-lg bg-white lg:m-3 lg:ml-6">
        <PurchaseTrends />
      </div>

      <div className=" hidden lg:block lg:w-1/3 m-3 bg-gray-400 bg-opacity-10 rounded-lg">
        <h2 className="text-lg font-semibold mt-5 mr-3 ml-3" style={{fontFamily: 'Poppins' , color: 'rgb(30 , 30 , 30)'}}>
          "Take the Stress Out of Finance - Our Software Makes Managing Your Money Simple and Efficient".
        </h2>

        <h2 className="text-md mt-2 ml-4 mr-4" style={{fontFamily: 'tahoma' , color: 'rgb(30 , 30 , 30)'}}>
          You can say goodbye to spreadsheets and paperwork our software is your all-in-one solutions for effortless financial management
        </h2>
        <svg className="w-full h-32 mt-4" viewBox="0 0 400 100">
          <path
            d="M0,50 L50,30 L100,70 L150,20 L200,60 L250,10 L300,50 L350,0 L400,40"
            fill="none"
            stroke="#0d9488"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>

    <div className=" flex lg:flex-row flex-col lg:mr-5 h-80 mb-20">
      <div className="lg:w-2/3 w-full rounded-lg bg-white m-3 lg:ml-6 h-full bg-gray-400  bg-opacity-20  shadow-lg rounded-lg">
      
      <h2 className="text-lg font-semibold mt-5 mr-3 ml-3" style={{fontFamily: 'Poppins' , color: 'rgb(30 , 30 , 30)'}}>
          "Take the Stress Out of Finance - Our Software Makes Managing Your Money Simple and Efficient".
        </h2>

        <h2 className="text-md mt-2 ml-4 mr-4" style={{fontFamily: 'tahoma' , color: 'rgb(30 , 30 , 30)'}}>
          You can say goodbye to spreadsheets and paperwork our software is your all-in-one solutions for effortless financial management
        </h2>
     
        <svg className="max-w-full h-32 mt-4" viewBox="0 0 400 100">
          <path
            d="M0,50 L50,30 L100,70 L150,20 L200,60 L250,10 L300,50 L350,0 L400,40"
            fill="none"
            stroke="#0d9488"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      
      </div>
      <div className="lg:w-1/3 w-full rounded-lg bg-white m-3 h-full">
      <PieChart />
      </div>
    </div>



  </div>
}

export default Dashboard;