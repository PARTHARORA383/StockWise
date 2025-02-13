import axios from "axios"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faIndianRupeeSign, faPlus, faSearch , faMultiply, faRupee, faRupeeSign } from "@fortawesome/free-solid-svg-icons"
import { faUser, faBuilding  } from '@fortawesome/free-regular-svg-icons';

const SalesList = () => {



  const [sales, setSales] = useState([])
  const [selectedsale , setSelectedSale] = useState()
  const [rendersale , setRenderSale] = useState(false)
  const { companyid , uid } = useParams()
  const [search, setSearch] = useState("");
  const [ isClosing  , setIsClosing] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {


    const FetchSales = async () => {

      try {

        const response = await axios.get(`http://localhost:3000/Sales/${uid}/${companyid}`)
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
    navigate(`/SalesForm/${uid}/${companyid}`)
  }

  const filteredsale = sales.filter((sale) => {
    return (
      sale.billNumber.toLowerCase().includes(search.toLowerCase()) ||
      sale.dealer.toLowerCase().includes(search.toLowerCase()) ||
    sale.Productname.toLowerCase().includes(search.toLowerCase()) 
)

  })



    
  const totalamount = filteredsale.reduce((acc, sale) => acc + sale.rate * sale.quantity 
  , 0);

const total_amount_postGst = filteredsale.reduce((acc, sale) => acc + 
sale.total_amount_postGst
  , 0);



    const handleanimating = (closeFunction)=>{

      setIsClosing(true)
      setTimeout(()=>{
        closeFunction(false)
        setIsClosing(false)
      },600)
  }


  return <div className="ml-8 ">
        <div className=" sticky z-20 border-b-2 top-0 bg-white h-16 text-supabaseGray-dark text-3xl flex items-center justify-between">
        <div className="w-1/4 ml-5 ">Sales</div>
        
      </div>

      
    <div className="grid grid-cols-12 bg-gray-100 p-14 border-t-2 border-b-2 border-supabaseGray-light">




<div className={`flex flex-col justify-start text-3xl col-span-3  bg-gradient-to-l from-teal-600 to-teal-800 rounded-xl  text-white px-4 py-2.5 hover:scale-105 transition-transform duration-200`}>
  <div className="text-xl font-light  text-white p-3">
    <h2>Gross Sales Value</h2>
  </div>
  <div className="font-normal text-3xl pl-5">
    <h2> <FontAwesomeIcon icon={faIndianRupeeSign} />{"  " + totalamount}</h2>
  </div>
</div>
<div className="col-span-3 ml-6">


<div className={`flex flex-col justify-start text-3xl col-span-3  bg-gradient-to-l from-teal-600 to-teal-800 rounded-xl  text-white px-4 py-2.5 hover:scale-105 transition-transform duration-200`}>
  <div className="text-xl font-light  text-white p-3">
    <h2>Total Sales Value</h2>
  </div>
  <div className="font-normal text-3xl pl-5">
    <h2> <FontAwesomeIcon icon={faIndianRupeeSign} />{"  " + total_amount_postGst}</h2>
  </div>
</div>

</div>
</div>

      
          {rendersale && (
      
            <div className={`z-30 fixed inset-0  h-screen bg-black bg-opacity-30 transition-transform duration-300 ${isClosing ? "animate-fadeOut" : "animate-fadeIn"}`}>
              <div className={`fixed z-30 top-0 right-0 h-screen bg-white overflow-y-auto  overflow-x-hidden shadow-lg ${isClosing ? "animate-slideOut" : "animate-slideIn"} `}style={{ width: "600px"}}>
      
                <div className="text-2xl m-4 top-0 right-0 fixed hover:bg-gray-200 hover : bg-opacity-5 hover:text-red-500 cursor-pointer mr-5 mt-3 w-10 h-10 flex items-center justify-center " onClick={() => {
                  handleanimating(setRenderSale)
                }} ><FontAwesomeIcon icon={faMultiply} /></div>
                <div className="text-2xl text-center mt-10">
                  Sale
                </div>
      
                <div className="text-2xl ml-4 mt-4 mb-1s font-bold">{}</div>
               
      
                <div className="flex justify-between items-center m-4">
                  <div className="text-xl "> Sale Date :</div>
                  <div className="text-xl ml-4 text-gray-700 ">{new Date(selectedsale.date).toLocaleDateString('en-CA')}</div>
                </div>
      
                <div className="flex justify-between items-center m-4">
                  <div className="text-xl ">  Invoice No. :</div>
                  <div className=" text-xl mr-4  text-gray-700"> {selectedsale.billNumber}</div>
                </div>
      
                <div className="flex justify-between items-center m-4">
                  <div className="text-xl ">  Vendor :</div>
                  <div className=" text-xl mr-4  text-gray-700"> {selectedsale.dealer}</div>
                </div>
                <div className="flex justify-between items-center m-4">
                  <div className="text-xl "> Payment Method :</div>
                  <div className=" text-xl mr-4  text-gray-700"> {selectedsale.paymentType}</div>
                </div>
      
                <div className="flex justify-between items-center m-4">
                  <div className="text-xl ">  Rate :</div>
                  <div className=" text-xl mr-4  text-gray-700"> {selectedsale.rate}</div>
                </div>
      
                <div className="flex justify-between items-center m-4">
                  <div className="text-xl ">  Quantity :</div>
                  <div className=" text-xl mr-4  text-gray-700"> {selectedsale.quantity}</div>
                </div>
      
      
                <div className="m-4">
                  <div className="text-xl "> Description : </div>
                  <div className=" text-xl mr-4   break-words text-justify text-gray-700 "> {selectedsale.description}</div>
                </div>
                <div className="flex justify-between items-center m-4 mt-5 border-t-2 border-gray-700">
                  <div className="text-xl mt-2"> {"Sub Total (excl. gst)"}</div>
                  <div className=" text-xl mr-4 mt-2  text-gray-700"> {selectedsale.total_amount}</div>
                </div>
                <div className="flex justify-between items-center m-4 border-gray-700">
                <div className="text-xl mt-2">GST :</div>

                  <div className=" text-xl mr-4 mt-2  text-gray-700"> { selectedsale.gstRate}</div>
                </div>
                <div className="flex justify-between items-center m-4 mt-5 border-t-2 border-gray-700">
                  <div className="text-xl mt-2">Total amount</div>
                  <div className=" text-xl mr-4 mt-2  text-gray-700"> {selectedsale.total_amount_postGst}</div>
                </div>
      
      
      
      
              </div>
            </div>
          )}
       





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
          <h2 className="text-xl font-semibold"> Total Amount</h2>
        </div>
      </div>

      {filteredsale.map((sale, index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-white rounded-lg shadow-lg p-4 mb-6 text-gray-800 hover:bg-blue-300 hover:bg-opacity-30" onClick={()=>{
              setSelectedSale(sale)
              setRenderSale(true)
          }}
        >
       
          <div className="flex-1 mx-2">
            <h2 className="text-lg font-semibold">
              <p><FontAwesomeIcon icon={faBuilding} />{" " + sale.dealer}</p>
            </h2>
          </div>
          <div className="flex-1 mx-2">
          <h2 className="text-lg font-semibold">
            <p>{new Date(sale.date).toLocaleDateString('en-CA') || ""}</p>
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
              <p><FontAwesomeIcon icon={faIndianRupeeSign} />{"  " + sale.total_amount_postGst}</p>
            </h2>
          </div>
        </div>
      ))}
    </div>
  </div>

}


export default SalesList;