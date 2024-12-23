import axios from "axios"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faIndianRupeeSign, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons"
import { faUser, faBuilding, } from '@fortawesome/free-regular-svg-icons';

const SalesList = () => {



  const [sales, setSales] = useState([])
  const { companyid } = useParams()
  const [search, setSearch] = useState("");
  const navigate = useNavigate()

  useEffect(() => {


    const FetchSales = async () => {

      try {

        const response = await axios.get(`http://localhost:3000/Sales/${companyid}`)
        setSales(response.data);

      } catch (e) {
        alert("Error Fetching Sales")
      }
    }
    FetchSales()

  }, [])




  const handleonSearch = (e) => {
    setSearch(e.target.value)
  }

  const navigatetoform = () => {
    navigate(`/SalesForm/${companyid}`)
  }

  const filteredsale = sales.filter((sale) => {
    return (
      sale.billNumber.toLowerCase().includes(search.toLowerCase()) ||
      sale.dealer.toLowerCase().includes(search.toLowerCase())     )
  })

  const totalamount = filteredsale.reduce((acc, sale) =>
    acc + sale.rate * sale.quantity

    , 0)



  return <div className="ml-3 ">
    <div className="h-14 text-2xl font-semibold">
      Stocks
    </div>

    <div className="grid grid-cols-12 bg-white p-14 border-t-2 border-b-2">





      <div className=" flex flex-col justify-start text-3xl col-span-2 border-r-2 ">
        <div className="text-xl font-regular  text-gray-600 p-3">
          <h2>Total sale Value</h2>
        </div>
        <div className="font-semibold text-3xl pl-5">
          <h2> <FontAwesomeIcon icon={faIndianRupeeSign} />{"  " + totalamount}</h2>
        </div>
      </div>
      <div className=" col-span-9">
        Products
      </div>
    </div>





    <div className=" grid grid-cols-12 h-24 ">
      <form className="w-full p-5 ml-10 col-span-3 ">
        <label for="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input type="search" onChange={handleonSearch} value={search} id="default-search" className="block w-full p-4 ps-10 text-md text-black font-semibold border border-gray-300 rounded-full bg-gray-100 focus:ring-blue-500 " placeholder="Search " required />

        </div>
      </form>
      <div className="col-span-9 flex justify-end items-center m-6 ">

        <div className="text-lg mr-10 ">
          <button type="button" className="py-3.5 px-5 me-2 mb-2 text-md font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-900 dark:hover:text-white dark:hover:bg-gray-700"><FontAwesomeIcon icon={faPlus} className="text-lg" onClick={navigatetoform} /> Add sale</button>
        </div>

      </div>
    </div>
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className=" flex justify-center bgiwhite rounded-lg shadow-lg p-4 mb-6 text-gray-950 ">
        <div className="flex-1 mx-2">
          <h2 className="text-xl font-semibold">Bill Number</h2>
        </div>
        <div className="flex-1 mx-2">
          <h2 className="text-xl font-semibold">Vendor</h2>

        </div>
        <div className="flex-1 mx-2">
          <h2 className="text-xl font-semibold">Date</h2>

        </div>
        <div className="flex-1 mx-2">
          <h2 className="text-xl font-semibold">Product</h2>

        </div>
        <div className="flex-1 mx-2">
          <h2 className="text-xl font-semibold">Rate</h2>
        </div>
        <div className="flex-1 mx-2">
          <h2 className="text-xl font-semibold">Quantity</h2>

        </div>
        <div className="flex-1 mx-2">
          <h2 className="text-xl font-semibold">Amount</h2>
        </div>
      </div>

      {filteredsale.map((sale, index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-white rounded-lg shadow-lg p-4 mb-6 text-gray-800"
        >
          <div className="flex-1 mx-2">
            <h2 className=" text-lg font-semibold ">
              <p>{sale.billNumber}</p>
            </h2>
          </div>
          <div className="flex-1 mx-2">
            <h2 className="text-lg font-semibold">
              <p><FontAwesomeIcon icon={faBuilding} />{" " + sale.dealer}</p>
            </h2>
          </div>
          <div className="flex-1 mx-2">
          <h2 className="text-lg font-semibold">
            <p>{"empty"}</p>
          </h2>
        </div>
          <div className="flex-1 mx-2">
            <h2 className="text-lg font-semibold">

              <p>{sale.Productname}</p>
            </h2>
          </div>
          <div className="flex-1 mx-2">
            <h2 className="text-lg font-semibold">

              <p><FontAwesomeIcon icon={faIndianRupeeSign} />{"  " + sale.rate}</p>
            </h2>
          </div>
          <div className="flex-1 mx-2">
            <h2 className="text-lg font-semibold">

              <p>{sale.quantity}</p>
            </h2>
          </div>
          <div className="flex-1 mx-2">
            <h2 className="text-lg font-semibold">
              <p><FontAwesomeIcon icon={faIndianRupeeSign} />{"  " + sale.total_amount}</p>
            </h2>
          </div>
        </div>
      ))}
    </div>
  </div>

}


export default SalesList;