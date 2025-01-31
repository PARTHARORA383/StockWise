import axios from "axios"

import { useState, useRef, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import GetProduct from "../Hooks/UseProduct"
import { useCompany } from "./Companycontext";



const SalesForm = () => {


  const [BillNumber, setBillNumber] = useState('')
  const [Product, setProduct] = useState("")
  const [quantity, setQuantity] = useState('')
  const [dealer, setDealer] = useState('')
  const [rate, setRate] = useState('')



  const [showProductList, setShowProductList] = useState(false);
  const [showDealerList, setShowDealerList] = useState(false);
  const [confirmationbox, setConfirmationbox] = useState(false)
  const [AddMoreSale, setAddMoreSale] = useState(false)
   
  const {selectedProduct , setSelectedProduct} = useCompany()
  const {selectedProductid , setSelectedProductid} = useCompany()
  


  const { companyid  } = useParams()
  const navigate = useNavigate()


  const uid = JSON.parse(localStorage.getItem("uid"));


  const dealerRef = useRef(null);
  const saleRef = useRef(null);

  const Productref = useRef(null);
  const rateRef = useRef(null);
  const quantityRef = useRef(null);
  const modalRef = useRef(null)
  const handleonkeydown = (e, nextRef) => {
    if (e.key == 'Enter') {
      e.preventDefault()
      nextRef.current.focus()
    }

  }


  const AddSale = async () => {

    const newsale = {
      billNumber: BillNumber,
      Product: selectedProductid || null,
      Productname : selectedProduct || Product,
      dealer: dealer,
      quantity: Number(quantity),
      rate: Number(rate),
      total_amount: Number(quantity) * Number(rate),
    }

    try {
      const response = await axios.post(`http://localhost:3000/Sales/${uid}/${companyid}`, newsale)
      console.log(response.data)

      if (response.status == 200) {
        setConfirmationbox(false)
        alert("Sale listed")
        setAddMoreSale(true)
      }


    } catch (e) {
      alert("error Listing sale")
      setConfirmationbox(false)
      setSelectedProduct(null)
      setSelectedProductid(null)
    }
  }

  const handleconfirm = () => {
    AddSale();

  }

  const handlecancel = () => {
    setConfirmationbox(false)
  }


  const resetform = ()=>{
    setBillNumber("")
    setDealer("")
    setProduct('')
    setSelectedProduct(null)
    setSelectedProductid(null)
    setRate("")
    setQuantity('')
    
  }


  const handleaddmoresale = ()=>{
    setAddMoreSale(false)
    resetform()
  }

  const handlenotaddsale = ()=>{
    navigate(`/Sales/${uid}/${companyid}`)
  }

  useEffect(() => {
    // When the confirmation box appears, set focus on the modal
    if (confirmationbox) {
      modalRef.current?.focus();
    }
    if(AddMoreSale){
      saleRef.current?.focus()
    }
  }, [confirmationbox , AddMoreSale]);


  return <div className="">
    <div className=" grid grid-cols-12 h-full">




      {confirmationbox && (
        <div className="absolute z-50 inset-0 h-screen w-full flex justify-center items-center bg-black bg-opacity-50 transition duration-300 ease-in-out  "
          ref={modalRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleconfirm()
            }
            if (e.key === "Escape") {
              handlecancel()
            }
          }}
          tabIndex="0" >
          <div className=" text-center bg-white p-5 rounded-lg shadow-lg w-96" >
            <h2 className="text-xl mb-4">Are you sure you want to add this purchase?</h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:opacity-90"
              onClick={handleconfirm}
            >
              Yes
            </button>
            <button
              className="bg-blue-500 hover:opacity-90 text-white px-4 py-2 rounded mr-2"
              onClick={handlecancel}
            >
              No
            </button>


          </div>
        </div>
      )}



      {AddMoreSale && (
        <div className="absolute z-50 inset-0 h-screen w-full flex justify-center items-center bg-black bg-opacity-50 transition duration-300 ease-in-out  "
          ref={saleRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleaddmoresale()
            }
            if (e.key === "Escape") {
              handlenotaddsale()
            }
          }}
          tabIndex="0" >
          <div className=" text-center bg-white p-5 rounded-lg shadow-lg w-96" >
            <h2 className="text-xl mb-4">Do you want to add more sale</h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:opacity-90"
              onClick={handleaddmoresale}
            >
              Yes
            </button>
            <button
              className="bg-blue-500 hover:opacity-90 text-white px-4 py-2 rounded mr-2"
              onClick={handlenotaddsale}
            >
              No
            </button>


          </div>
        </div>
      )}



      <div className="col-span-full lg:col-span-8 h-screen relative w-full flex justify-center items-center bg-gray-100 ">

        {
          //Pop Out Sales Form 
        }
        <div className="bg-white  absolute shadow-lg rounded-lg p-8 flex flex-col m-10 w-full " style={{ height: "600px" , width : "1030px" }}>

          <div className=" text-center text-xl mb-10"> Register Your Daily Sales</div>

          <div className=" flex w-full mb-4 items-center">
            <label className=" text-gray-700 text-lg font-medium mb-1 w-1/3">
              Bill Number :
            </label>
            <input

              className={`text-lg w-full rounded-lg border-gray-200  border p-3 focus:outline-none focus:ring-blue-500 ${BillNumber.length > 0 ? 'bg-blue-300 bg-opacity-20' : 'bg-white'}`}
              id="BillNumber"
              value={BillNumber}
              placeholder="Enter Bill Number"
              onChange={(e) => setBillNumber(e.target.value)}
              onBlur={() => { ("") }}
              onKeyDown={(e) => { handleonkeydown(e, dealerRef) }}
              required
            />
          </div>


          <div className=" flex w-full mb-4 items-center">
            <label className="text-lg text-gray-700 font-medium mb-1 w-1/3">Vendor :</label>
            <input

              className={`text-lg w-full rounded-lg border-gray-200 border p-3 focus:outline-none focus:ring-blue-500 ${dealer.length > 0 ? 'bg-gray-300 bg-opacity-20' : 'bg-white'}`}
              id="Dealer"
              ref={dealerRef}
              value={dealer}
              placeholder="Enter Dealer Name"
              onChange={(e) => setDealer(e.target.value)}
              onFocus={() => {
                setShowDealerList(true)
                setShowProductList(false)
              }}

              onKeyDown={(e) => { handleonkeydown(e, Productref) }}
            />
          </div>


          <div className=" flex  items-center w-full mb-4">


            <label className="block text-gray-700 font-medium mb-1 text-lg w-1/3">
              Product
            </label>

            <input

              className={`text-lg w-full rounded-lg border-gray-200 border p-3 focus:outline-none focus:ring-blue-500 ${Product.length > 0 ? 'bg-gray-300 bg-opacity-20' : 'bg-white'}`}
              id="Product"
              ref={Productref}
              value={selectedProduct || Product}
              placeholder="Select Your Product"
      
              onFocus={() => {
                setShowDealerList(false)
                setShowProductList(true)
              }}
              onKeyDown={(e) => {handleonkeydown(e, rateRef) }}
              onChange={(e)=>{
                setProduct(e.target.value)
                setSelectedProduct()
                setSelectedProductid()
                            }}
            />

          </div>

          <div className="w-full flex items-center mb-4">

            <label className="block text-gray-700 font-medium mb-1 w-1/3 text-lg">Rate :</label>
            <input
              className={`text-lg w-full rounded-lg border-gray-200 border p-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${rate.length > 0 ? "bg-gray-300 bg-opacity-20" : "bg-white"}`}
              ref={rateRef}
              id="Rate"
              value={rate}
              placeholder="Enter Rate"
              onChange={(e) => setRate(e.target.value)}

              onKeyDown={(e) => { handleonkeydown(e, quantityRef) }}
            />
          </div>
          <div className=" flex w-full mb-6">
            <label className="block text-gray-700 font-medium mb-1 w-1/3 text-lg">
              Quantity :
            </label>
            <input
              className={`text-lg w-full rounded-lg border-gray-200  border p-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500${quantity.length > 0 ? " bg-blue-300 bg-opacity-20" : "bg-white"}`}
              ref={quantityRef}
              id="quantity"
              value={quantity}
              placeholder="Enter Quantity"
              onChange={(e) => setQuantity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key == 'Enter') {
                  setConfirmationbox(true);
                }
              }}

            />
          </div>
          <div className=" w-full text-center mt-5">

            <button
              onClick={() => { setConfirmationbox(true) }}
              className="bg-teal-700 hover:bg-teal-600 text-white font-medium py-3 rounded-lg shadow-md w-1/3 transition duration-300"
            >
              Register Sale
            </button>
          </div>
        </div>

      </div>

      <div className=" lg:col-span-4 overflow-y-auto">
        {showProductList && (
          
          <div className="hidden lg:block h-full bg-white shadow-md  transition delay-300 ease-in-out ">
            {/* This side section can display accounts or other relevant information */}
            <GetProduct/>
            {/* Display product list or other data here */}
          </div>
        )}

        {showDealerList && (
          
          <div className="hidden lg:block  h-full bg-white shadow-md   transition delay-300 ease-in-out ">
            {/* This side section can display accounts or other relevant information */}
            {/* Display product list or other data here */}
            Dealer
          </div>
        )}
        </div>

    </div>
  </div>

}


export default SalesForm;