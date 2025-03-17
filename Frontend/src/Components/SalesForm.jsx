import axios from "axios"

import { useState, useRef, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import GetProduct from "../Hooks/UseProduct"
import { useCompany } from "./Companycontext";
import CustomDatePicker from "./DatePicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus , faPlus , faMultiply } from "@fortawesome/free-solid-svg-icons";


const SalesForm = () => {

  const [BillNumber, setBillNumber] = useState('')
  const [Product, setProduct] = useState("")
  const [quantity, setQuantity] = useState('')
  const [dealer, setDealer] = useState('')
  const [rate, setRate] = useState('')
  const [gstRate, setGstRate] = useState("5")
  const [paymentType , setPaymentType] = useState("Cash")
  const [ description , setDescription ] = useState('')
  const [ isCustomGst , setisCustomGst] = useState(false)
  const [ VendorList , setVendorList] = useState([])
  const [ ProductList , setProductList] = useState([])
  const [addproduct , setAddProduct] = useState(false)
  const [newproduct , setNewProduct] = useState("")
  const [createbillbox , setCreateBillBox] = useState(false)
  const [showProductList, setShowProductList] = useState(false);
  const [showDealerList, setShowDealerList] = useState(false);
  const [confirmationbox, setConfirmationbox] = useState(false)
  const [AddMoreSale, setAddMoreSale] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const { vendor , setVendor} = useCompany()

  
  const { companyid  } = useParams()
  const navigate = useNavigate()

  const uid = JSON.parse(localStorage.getItem("uid"));

  const dealerRef = useRef(null);
  const saleRef = useRef(null);
  const Productref = useRef(null);
  const rateRef = useRef(null);
  const billingNumberref = useRef(null)
  const gstRef = useRef(null)
  const descriptionRef = useRef(null)
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
      Product: selectedProductId || null,
      Productname : selectedProduct || Product,
      dealer: vendor?.name || dealer,
      gstRate : gstRate ,
      paymentType : paymentType,
      description: description,
      quantity: Number(quantity),
      rate: Number(rate),
      total_amount: Number(quantity) * Number(rate),
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/Sales/${uid}/${companyid}`, newsale)
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
      setSelectedProductId(null)
    }

  }

  const handleconfirm = () => {
    AddSale();
  }

  const handlecancel = () => {
    setConfirmationbox(false)
  }

  const FetchProduct = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/ManufacturedProducts/${uid}/${companyid}`)
    setProductList(response.data)
    console.log(response.data)
  }

  useEffect(() => {
    FetchProduct()
  },[])

  const resetform = () => {
    setBillNumber("")
    setDealer("")
    setProduct('')
    setSelectedProduct(null)
    setSelectedProductId(null)
    setRate("")
    setQuantity('')
  }

  const handleaddmoresale = () => {
    setAddMoreSale(false)
    resetform()
  }

  const handlenotaddsale = () => {
    navigate(`/Sales/${uid}/${companyid}`)
  }

  useEffect(() => {
    if (confirmationbox) {
      modalRef.current?.focus();
    }
    if(AddMoreSale){
      saleRef.current?.focus()
    }
  }, [confirmationbox , AddMoreSale]);

  const qualitycounterplus = () => {
    setQuantity(Number(quantity) + 1)
  }

  const qualitycounterminus = () => {
    if (quantity > 0) {
      setQuantity(Number(quantity) - 1)
    }
  }

  const handleFetchvendors = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/vendor/${uid}/${companyid}`)
    setVendorList(response.data.fetchVendors)
    console.log("vendors are " + VendorList)
  }

  const handleFetchProducts = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/ManufacturedProducts/${uid}/${companyid}`)
    setProductList(response.data)
    console.log(response.data)
  }

  const handleAddProduct = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/ManufacturedProducts/${uid}/${companyid}`, {Productname: newproduct})
      console.log(response.data)
      if(response.status == 200){
        setAddProduct(false)
        setNewProduct("")
        handleFetchProducts()
        alert("Product added")
      }
    } catch(e) {
      alert("error adding product")
    }
  }

  const handleDeleteProduct = async (manufacturingid) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_BASE_URL}/ManufacturedProducts/${uid}/${companyid}/${manufacturingid}`)
      console.log(response.data)
      if(response.status == 200){
        handleFetchProducts()
        setSelectedProductId(null)
        alert("Product deleted")
      }
    } catch(e) {
      alert("error deleting product")
    }
  }

  const handlecreatebill = () => {
    setCreateBillBox(true)
  }

  const handlenotcreatebill = () => {
    setCreateBillBox(false)
  } 

  useEffect(() => {
    handleFetchvendors()
    handleFetchProducts()
  }, [companyid])

  return <div className="relative z-10">

    <div className="h-full">
    <div></div>
      <div className=" sticky z-20 border-b-2 top-0 bg-white h-16 text-supabaseGray-dark text-2xl flex items-center justify-between">
        <div className="w-1/4 ml-16 lg:ml-5">Add Sale</div>
        <div className=" w-1/5 text-center mr-2">

          <button
            onClick={() => { setConfirmationbox(true) }}
            className="bg-blue-500 hover:bg-blue-600 text-white text-lg py-2 rounded-lg shadow-md  transition duration-300  w-full"
          >
            Add Sale
          </button>
        </div>
      </div>

      {createbillbox && (
        
        <div className="absolute z-50 inset-0 h-screen w-full flex justify-center items-center bg-black bg-opacity-50 transition duration-300 ease-in-out"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handlecreatebill()
            }
            if (e.key === "Escape") {
              handlenotcreatebill() 
            }
          }}
          tabIndex="0">
          <div className="text-center bg-white p-5 rounded-lg shadow-lg w-96">
            <h2 className="text-lg mb-4">Do you want to create bill for this sale?</h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:opacity-90"
              onClick={handlecreatebill}
            >
              Create Bill
            </button>
            <button
              className="bg-blue-500 hover:opacity-90 text-white px-4 py-2 rounded mr-2" 
              onClick={handlenotcreatebill}
            >
              No
            </button>
          </div>
        </div>
      )}

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
            <h2 className="text-lg mb-4">Are you sure you want to add this Sale?</h2>
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
            <h2 className="text-lg mb-4">Do you want to add more sale</h2>
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

<div className="grid  grid-cols-12 h-full  border-r-2 bg-gray-200  pl-2 pr-2 pb-24 pt-10 lg:pr-20 lg:pl-10 ">

        <div className=" col-span-12 lg:col-span-10 relative bg-white shadow-lg rounded-lg  pl-4 pr-4 lg:p-10 flex flex-col w-full  inset-0" style={{ height: "100%"  , maxHeight: "720px" }}>

<div className="text-2xl "> Register Sale</div>
<div className="lg:text-lg text-md mb-10 text-gray-500"> Easily register your daily Sales to know your accurate analytics</div>
<div className=" absolute top-0 right-0  mt-24 mr-2 flex lg:w-52 ">
  <CustomDatePicker/>
</div>

<div className="mt-5 w-full mb-4 items-center space-y-2">
  <label className="lg:text-lg text-md text-gray-700  font-medium  ">
    Invoice No.
  </label>
  <input
    ref={billingNumberref}
    className={`lg:text-lg text-md w-full rounded-lg border-gray-200  border p-2 mt-2 focus:outline-blue-300 focus:ring-blue-500 ${BillNumber.length > 0 ? 'bg-gray-300 bg-opacity-20 ' : 'bg-white'}`}
    id="billingNumber"
    value={BillNumber}
    placeholder="Enter Invoice No."
    onChange={(e) => setBillNumber(e.target.value)}
    onFocus={() =>
      setShowProductList(false)
    }
    
    onKeyDown={(e) => { handleonkeydown(e, dealerRef, null) }}
    required
  />
</div>

<div className=" mt-2 w-full mb-4 items-center space-y-2">
  <label className="lg:text-lg text-md  text-gray-700 font-medium mb-1 ">Vendor :</label>
  <input
    className={`lg:text-lg text-md  w-full rounded-lg border-gray-200 border p-2 focus:outline-blue-300 focus:ring-blue-500  ${dealer.length > 0 ? 'bg-gray-300 bg-opacity-20' : 'bg-white'}`}
    id="Dealer"
    ref={dealerRef}
    value={vendor?.name||dealer}
    placeholder="Enter Dealer Name"
    onChange={(e) => {
      setDealer(e.target.value)
    }}  
    onFocus={() => {
      setShowDealerList(true)
      setShowProductList(false)
    }}
    onKeyDown={(e) => { handleonkeydown(e, Productref, billingNumberref) }}
  />
</div>

<div className="w-full mb-4 items-center space-y-2">
  <label className="block text-gray-700 font-medium mb-1 w-1/3 lg:text-lg text-md ">Product :</label>
  <input
    className={`lg:text-lg text-md  w-full rounded-lg border-gray-200 border p-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${Product.length > 0 ? "bg-gray-300 bg-opacity-20" : "bg-white"}`}
    ref={Productref}
    id="Product"
    value={selectedProduct}
    placeholder="Enter Product Name"
    onChange={(e) => {
      setProduct(e.target.value)
    }}
    onFocus={() => {
      setShowProductList(true)
      setShowDealerList(false)
    }}
    onKeyDown={(e) => { handleonkeydown(e, rateRef, dealerRef) }}
  />
</div>

<div className="w-full mb-4 items-center space-y-2">
  <label className="block text-gray-700 font-medium mb-1 w-1/3 lg:text-lg text-md ">Rate :</label>
  <input
    className={` lg:text-lg text-md  w-full rounded-lg border-gray-200 border p-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${rate.length > 0 ? "bg-gray-300 bg-opacity-20" : "bg-white"}`}
    ref={rateRef}
    id="Rate"
    value={rate}
    placeholder="Enter Rate"
    onChange={(e) => setRate(e.target.value)}
    onFocus={() => {
      setShowProductList(false)
      setShowDealerList(false)
    }}
    onKeyDown={(e) => { handleonkeydown(e, quantityRef, Productref) }}
  />
</div>

<div className=" flex w-2/3 mb-6  items-center">
  <label className="block text-gray-700 font-medium mb-1 lg:text-lg text-md ">
    Quantity :
  </label>
  <div className=" flex items-center justify-center">
    <input
      className={`lg:text-lg text-md  w-1/2 rounded-lg border-gray-200  border p-2 ml-5 mr-5 focus:border-blue-500 focus:outline-none focus:ring-blue-500${quantity.length > 0 ? " bg-blue-300 bg-opacity-20" : "bg-white"} `}
      ref={quantityRef}
      id="quantity"
      value={quantity}
      placeholder="Enter Quantity"
      onChange={(e) => setQuantity(e.target.value)}
      onKeyDown={(e) => {
        handleonkeydown(e, descriptionRef, rateRef)
      }}
    />
    <div className="flex space-x-3">
      <div className="bg-teal-600 hover:bg-teal-800 active:bg-teal-700 rounded-full h-10 w-10 flex items-center justify-center transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95" onClick={qualitycounterminus} >
        <FontAwesomeIcon icon={faMinus} className=" text-md lg:text-lg text-white" />
      </div>
      <div className="bg-teal-600 hover:bg-teal-800 active:bg-teal-700 rounded-full h-10 w-10 flex items-center justify-center transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95" onClick={qualitycounterplus}>
        <FontAwesomeIcon icon={faPlus} className="  text-md lg:text-lg text-white" />
      </div>
    </div>
  </div>
</div>

</div>

<div className=" mt-4 col-span-12 lg:col-span-10 bg-white shadow-lg rounded-lg  pl-4 lg:p-10 flex inset-0 space-x-4 items-center  " style={{ height: "100px" }}>
<div className="lg:text-lg text-md  font-medium">Payment Method :</div>
<select className="lg:text-lg text-md  bg-supabaseGray-light text-white  w-1/3 lg:w-1/6 text-center h-10 rounded-lg" value={paymentType}
  onChange={(e) => {
    setPaymentType(e.target.value)
  }}>
  <option>Cash</option>
  <option>Online</option>
</select>
</div>

<div className=" mt-4 col-span-12 lg:col-span-10 bg-white shadow-lg rounded-lg  pl-4 lg:p-10 flex flex-col inset-0  space-y-2 justify-center items-start" style={{ height: "150px" }}>
<div className=" text-md lg:text-lg font-medium"> GST:</div>
<div className="w-full space-x-4">
  {isCustomGst ? (
    <input
      type="number"
      value={gstRate}
      onChange={(e) => setGstRate(parseFloat(e.target.value))}
      className="border  lg:text-lg text-md rounded-lg w-1/3 p-3"
      placeholder="Enter custom GST % "
    />
  ) : (
    <select
      value={gstRate}
      onChange={(e) => setGstRate(parseFloat(e.target.value))}
      className="border p-3 lg:text-lg text-md rounded-lg bg-supabaseGray-light text-white w-1/3"
    >
      <option value={5}>5%</option>
      <option value={12}>12%</option>
      <option value={18}>18%</option>
    </select>
  )}
  <button
    onClick={() => setisCustomGst(!isCustomGst)}
    className="mt-2 text-lg text-teal-600 underline"
  >
    {isCustomGst ? "Select from dropdown" : "Enter custom GST"}
  </button>
</div>
</div>

<div className=" mt-4 col-span-12 lg:col-span-10 bg-white shadow-lg rounded-lg  pl-4 lg:p-10 flex  flex-col inset-0  justify-start items-start  space-y-2 " style={{ height: "250px" }}>
<div className="text-lg font-medium">Description</div>
<textarea
  className={`text-lg w-full rounded-lg border-gray-200  border p-2 mr-5 focus:border-blue-500 focus:outline-none focus:ring-blue-500 h-52 ${description.length > 0 ? " bg-blue-300 bg-opacity-20" : "bg-white"} `}
  ref={descriptionRef}
  id="description"
  value={description}
  placeholder="Enter Description"
  onChange={(e) => setDescription(e.target.value)}
  onKeyDown={(e) => {
    handleonkeydown(e, null, rateRef)
  }}
/>
</div>

<div className="col-span-12 lg:col-span-10 rounded-lg pt-6 flex items-center justify-end">
<button
  onClick={() => { setConfirmationbox(true) }}
  className="bg-blue-500 hover:bg-blue-600 text-white text-lg py-2 rounded-lg shadow-lg  transition duration-300  w-1/4"
>
  Add Sale
</button>
</div>

      <div className=" col-span-12 lg:col-span-4 overflow-y-auto">
        {showProductList && (
          <div className="inset-0 fixed bg-black bg-opacity-30 lg:block h-screen w-screen shadow-md transition delay-300 ease-in-out z-50">  
            {addproduct && (
              <div className="bg-white fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[250px] w-[500px] p-8 rounded-lg shadow-lg">
                 <div className="text-2xl absolute top-3 right-3 hover:bg-gray-200 hover:text-red-500 cursor-pointer w-10 h-10 flex items-center justify-center" 
                onClick={() => setShowProductList(false)}>
                <FontAwesomeIcon icon={faMultiply} />
              </div>
                  <div>             
                  <h2 className="text-lg mb-6 text-center">Add a Product</h2>
                  <input 
                    type="text" 
                    value={newproduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    className="w-full rounded-lg border-gray-200 border p-2 mb-6 focus:border-blue-500 focus:outline-none focus:ring-blue-500" 
                    placeholder="Enter Product Name" 
                  />
                  <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white text-md py-2 rounded-lg shadow-lg transition duration-300 w-full" 
                    onClick={handleAddProduct}
                  >
                    Create Product
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white fixed right-0 min-h-screen w-[400px] p-4 rounded-lg shadow-lg animate-slideIn">
              <div className="text-2xl absolute top-3 right-3 hover:bg-gray-200 hover:text-red-500 cursor-pointer w-10 h-10 flex mtitems-center justify-center" 
                onClick={() => setShowProductList(false)}>
                <FontAwesomeIcon icon={faMultiply} />
              </div>
              <h2 className="text-lg mb-6 text-center mt-8">Products List</h2>
              <button 
                className="bg-red-500 hover:bg-red-700 text-white text-md py-2 rounded-lg shadow-lg transition duration-300 w-full mb-4" 
                onClick={() => handleDeleteProduct(selectedProductId)}
              >
                Delete Product
              </button>
              <button 
                className="bg-blue-500 hover:bg-blue-700 text-white text-md py-2 rounded-lg shadow-lg transition duration-300 w-full " 
                onClick={() => setAddProduct(true)}
              >
                Add Product
              </button>
          
              <div className="mt-4 w-full" >
                {ProductList && ProductList.length > 0 ? (
                  <div>
                    {ProductList.map((product) => (
                      <div 
                        className="bg-gradient-to-tr text-black text-lg p-2 rounded-lg hover:bg-blue-300 hover:bg-opacity-30 flex justify-between items-center" 
                        key={product._id}
                        onClick={() => {
                        
                          setSelectedProduct(product.Productname);
                          setShowProductList(false);
                        }}
                      >
                        <div
                       
                        >
                          {product.Productname}
                        </div>
                        <input
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer"
                          onClick={(e) => {
                            setSelectedProductId(product._id)
                          
                            e.stopPropagation();
                            // Handle checkbox selection of product._id
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-supabaseGray-light text-lg text-center mt-6">
                    Please Add a Product To continue
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
              
        {showDealerList && (
           <div className="  bg-black fixed inset-0 bg-opacity-30 z-50">
                    <div className=" lg:block h-full bg-white shadow-md  lg:w-1/4 transition delay-300 ease-in-out overflow-y-auto fixed right-0 top-15 z-50 pb-16 animate-slideIn">
                      <div className=" text-xl lg:text-2xl text-supabaseGray-dark m-4 text-medium mt-6 text-center"> Vendors</div>
                      <div className="text-lg lg:text-2xl m-4 top-0 right-0 fixed hover:bg-gray-200 hover : bg-opacity-5 hover:text-red-500 cursor-pointer mr-5 mt-3 w-9 h-9 flex items-center justify-center  " onClick={() => {
                        setShowDealerList(false)
                      }} ><FontAwesomeIcon icon={faMultiply} />
                      </div>
                      <div className="ml-10 mb-4 h-10 bg-blue-500 hover:bg-blue-700  rounded-xl flex items-center justify-center text-lg text-white cursor-pointer" style={{ width: "300px" }} onClick={() => {
                          navigate(`/Vendors/${uid}/${companyid}`, { state: { from: `/SalesForm/${uid}/${companyid}` } })
                      }}>
                        <FontAwesomeIcon icon={faPlus} className="mr-5" />
                        Create a New Vendor
                      </div>
                      {VendorList.length > 0 ? (
                        <div>
                          {VendorList.map((vendor) => (
                            <div className="bg-gradient-to-tr  text-black text-lg  p-2 rounded-lg mb-2 hover:bg-blue-300 hover:bg-opacity-30 " key={vendor._id}  onClick={()=>{
                              setVendor(vendor)
                              setShowDealerList(false)
                            }}>
                              {vendor.name}
                            </div>
                          ))}
                        </div>
                      ) : (<div className="text-supabaseGray-light text-lg text-center mt-6">Please Add a Vendor To continue</div>)}
                    </div>
                  </div>
                )}
        
        </div>
        </div>
    </div>
  </div>

}

export default SalesForm;