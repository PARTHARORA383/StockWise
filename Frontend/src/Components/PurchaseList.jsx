import { useEffect, useState  , useRef} from "react";
import axios from "axios"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCross, faDeleteLeft, faEdit, faIndianRupeeSign, faMultiply, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import { redirect, useNavigate, useParams } from "react-router-dom";


import { faUser, faBuilding, } from '@fortawesome/free-regular-svg-icons';
import { useCompany } from "./Companycontext";
import PurchaseTrends from "./PurchaseTrends";





const PurchaseList = () => {
  const [purchases, setPurchases] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPurchase, setSelectedPurchase] = useState()
  const [renderPurchaseInfo, setRenderPurchaseInfo] = useState(false)
  const { companyid , uid  } = useParams();
  const [BillNumber, setBillNumber] = useState("");
  const [ isClosing  , setIsClosing] = useState(false)
  const [dealer, setDealer] = useState("");

  const [item, setItem] = useState("")

  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");

  const[confirmationbox , setConfirmationbox] = useState(false)
  const[DeleteBox , setDeleteBox] = useState(false)



  const modalRef = useRef(null)

    
      const fetch = async () => {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/purchase/${uid}/${companyid}`)
        setPurchases(response.data);
      }

  useEffect(() => {

    fetch();
  }, [companyid])

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedPurchase) {
      setBillNumber(selectedPurchase.billing_number || "");
      setDealer(selectedPurchase.dealer || "");
      setItem(selectedPurchase.Product.item || "");
      setRate(selectedPurchase.rate || "");
      setQuantity(selectedPurchase.quantity || "");
    }
  }, [selectedPurchase]);


  const handleDeletePurchase  = async ()=>{

    try{

      const DeletePurchase = await axios.delete(`${process.env.REACT_APP_BACKEND_BASE_URL}/purchase/${uid}/${companyid}/${selectedPurchase.billing_number}
`)

      if(DeletePurchase.status === 200){
        setDeleteBox(false)
        setRenderPurchaseInfo(false)
        alert("Purchase Deleted")

        fetch()
      }
    }catch(e){
      setDeleteBox(false)
      alert("Error Deleting Purchase")
    }
  }
  const handleUpdatePurchase = async ()=>{

    try{

      
      const updatePurchase = await axios.put(`${process.env.REACT_APP_BACKEND_BASE_URL}/purchase/${companyid}/${selectedPurchase.billing_number}` ,{
        
        BillNumber : BillNumber,
        dealer : dealer,
        Product : {
          item : item
        },
        rate : Number(rate),
        quantity : Number(quantity)
      })

      if(updatePurchase.status === 200){
        setConfirmationbox(false)
        setRenderPurchaseInfo(false)
        alert("Purchase Updated")
        fetch()
      }
    }catch(e){
        alert("Cannot update Purchase")
        setConfirmationbox(false)
        setRenderPurchaseInfo(false)
    }
    }


  const navigatetoform = () => {
    navigate(`/Purchaseform/${uid}/${companyid}`)
  }


  const handleonSearch = (e) => {
    setSearch(e.target.value);
  }

  const filteredPurchase = purchases.filter((purchase) => {
    return (
      purchase.dealer.toLowerCase().includes(search.toLowerCase()) ||
      purchase.Product.item.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleconfirm = ()=>{
    handleUpdatePurchase()
  }

  const handlecancel = ()=>{
    setConfirmationbox(false)
  }

  const handleDelete = ()=>{
handleDeletePurchase()
    
}

  const totalamount = filteredPurchase.reduce((acc, purchase) => acc + purchase.rate * purchase.quantity 
    , 0);

  const total_amount_postGst = filteredPurchase.reduce((acc, purchase) => acc + 
  purchase.total_amount_postGst
    , 0);


    

    const handleanimating = (closeFunction)=>{

      setIsClosing(true)
      setTimeout(()=>{
        closeFunction(false)
        setIsClosing(false)
      },600)
  }

  return <div className={`ml-8 `}>
      
      <div className=" sticky z-20  top-0  bg-gray-100 h-16 text-supabaseGray-dark text-4xl flex items-center justify-between font-sans font-medium">
        <div className="w-1/4 ml-5 text-supabaseGray-dark">Purchases</div>
     
      </div>

        
      {DeleteBox && (
        <div className="fixed inset-0 z-50 h-screen flex justify-center items-center bg-black bg-opacity-50">
          <div className=" text-center bg-white p-5 rounded-lg shadow-lg w-1/3">
            <div className="mb-5">
            </div>
            <h2 className="text-xl mb-4">Are you sure you want to delete this Purchase</h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:opacity-90"
              onClick={handleDelete}
            >
              Yes
            </button>
            <button
              className="bg-blue-500 hover:opacity-90 text-white px-4 py-2 rounded mr-2"
              onClick={() => {
                setDeleteBox(false)
              }}
            >
              No
            </button>



          </div>
        </div>
      )}

      
    {confirmationbox && (
            <div className="absolute z-50 inset-0 h-screen w-full flex justify-center items-center bg-black bg-opacity-50 transition duration-300 ease-in-out  " 
            ref={modalRef}  
               onKeyDown={(e)=>{
                if(e.key === "Enter"){
                  handleconfirm()
                }
                if(e.key === "Escape"){
                  handlecancel()
                }
               }}
               tabIndex="0" >
              <div className=" text-center bg-white p-5 rounded-lg shadow-lg w-96" >
                <h2 className="text-xl mb-4">Are you sure you want to update this purchase?</h2>
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



    {/* {renderPurchaseInfo && (
      <div className="bg-black bg-opacity-60  z-10 fixed inset-0 h-screen  transition-transform  duration-300" >
        <div className="fixed top-0 right-0 bg-white h-full" style={{ width: "600px" }}>
          <div className="flex justify-between items-center">

            <h1 className=" text-2xl font-bold font-sans mt-5 ml-5 m-2">Purchase
              Information</h1>
            <div className="text-2xl mr-8 hover:text-red-500" onClick={() => {
              setRenderPurchaseInfo(false)
            }}><FontAwesomeIcon icon={faMultiply} /></div>
          </div>

          <h1 className="text-xl  ml-5">Check your purchase details</h1>
          <div className="flex flex-col ">

            <div className="flex flex-col p-4">
              <h2 className="text-xl font-bold ml-4">Invoice No.</h2>
              <div className="" style={{ width: "500px" }}> <input value={BillNumber}
                onChange={(e) => { setBillNumber(e.target.value) }
                }
                placeholder={selectedPurchase?.billing_number || ""}
                className="text-xl p-3 border-2 w-full h-11 rounded-md ml-4 " ></input></div>
            </div>
            <div className="flex flex-col p-4">
              <h2 className="text-xl font-bold  ml-4">Vendor</h2>
              <div className="" style={{ width: "500px" }}> <input value={dealer}
                onChange={(e) => { setDealer(e.target.value) }
                }
                placeholder={selectedPurchase?.dealer || ""}
                className="text-xl p-3 border-2 w-full h-11 rounded-md ml-4"></input></div>
            </div>
            <div className="flex flex-col p-4">
              <h2 className="text-xl font-bold  ml-4">Date</h2>
              <div className="" style={{ width: "500px" }}> <input value={new Date(selectedPurchase.date).toLocaleDateString('en-CA') || ""} className="text-xl p-3 border-2 w-full h-11 rounded-md ml-4"></input></div>
            </div>
            <div className="flex flex-col p-4">
              <h2 className="text-xl font-bold  ml-4">Product</h2>
              <div className="" style={{ width: "500px" }}> <input value={item}
                placeholder={selectedPurchase?.Product.item || ""}
                onChange={(e) => { setItem(e.target.value) }
                }
                className="text-xl p-3 border-2 w-full h-11 rounded-md ml-4"></input></div>
            </div>
            <div className="flex flex-col p-4">
              <h2 className="text-xl font-bold  ml-4">Rate</h2>
              <div className="" style={{ width: "500px" }}> <input value={rate}
                placeholder={selectedPurchase?.rate || ""}
                onChange={(e) => { setRate(e.target.value) }
                }
                className="text-xl p-3 border-2 w-full h-11 rounded-md ml-4"></input></div>
            </div>
            <div className="flex flex-col p-4">
              <h2 className="text-xl font-bold  ml-4">Quantity</h2>

              <div className="" style={{ width: "500px" }}> <input value={quantity}
                onChange={(e) => { setQuantity(e.target.value) }
                }
                placeholder={selectedPurchase?.quantity || ""}
                className="text-xl p-3 border-2 w-full h-11 rounded-md ml-4"></input></div>
            </div>
            <div className="flex flex-col p-4">
              <h2 className="text-xl font-bold  ml-4"> Total amount</h2>
              <div className="" style={{ width: "500px" }}> <input value={selectedPurchase.rate * selectedPurchase.quantity || ""} className="text-xl p-3 border-2 w-full h-11 rounded-md ml-4"></input></div>
            </div>

            <div className="flex m-5">

              <div  onClick={
                ()=>{setConfirmationbox(true)}
              } className="w-1/2">
              <button type="button" className="py-3.5  me-2 mb-2 text-md font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-teal-800 dark:text-white  dark:hover:text-white dark:hover:bg-gray-700  w-2/3 text-xl"><FontAwesomeIcon icon={faEdit} className="text-lg" /> Update</button>
              </div>

                <div className="w-1/2" onClick={()=>{
                  setDeleteBox(true)
                }}>

              <button type="button" className=" py-3.5 me-2 mb-2 text-md font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-red-700 dark:text-white  dark:hover:text-white dark:hover:bg-gray-700 w-2/3 333text-xl"><FontAwesomeIcon icon={faDeleteLeft} className="text-lg" /> Delete</button>
              </div>


            </div>
            <div>
            </div>
          </div>
        </div>
      </div>
    )} */}



{renderPurchaseInfo && (
      
      <div className={`z-30 fixed inset-0  h-screen bg-black bg-opacity-30 transition-transform duration-300 ${isClosing ? "animate-fadeOut" : "animate-fadeIn"}`}>
        <div className={`fixed z-30 top-0 right-0 h-screen bg-white overflow-y-auto  overflow-x-hidden shadow-lg ${isClosing ? "animate-slideOut" : "animate-slideIn"} `}style={{ width: "600px"}}>

          <div className="text-2xl m-4 top-0 right-0 fixed hover:bg-gray-200 hover : bg-opacity-5 hover:text-red-500 cursor-pointer mr-5 mt-3 w-10 h-10 flex items-center justify-center " onClick={() => {
            handleanimating(setRenderPurchaseInfo)
          }} ><FontAwesomeIcon icon={faMultiply} /></div>
          <div className="text-2xl text-center mt-10">
            Purchase
          </div>

          <div className="text-2xl ml-4 mt-4 mb-1s font-bold">{}</div>
         

          <div className="flex justify-between items-center m-4">
            <div className="text-xl "> Purchase Date :</div>
            <div className="text-xl ml-4 text-gray-700 ">{new Date(selectedPurchase.date).toLocaleDateString('en-CA')}</div>
          </div>

          <div className="flex justify-between items-center m-4">
            <div className="text-xl ">  Invoice No. :</div>
            <div className=" text-xl mr-4  text-gray-700"> {selectedPurchase.billing_number}</div>
          </div>

          <div className="flex justify-between items-center m-4">
            <div className="text-xl ">  Vendor :</div>
            <div className=" text-xl mr-4  text-gray-700"> {selectedPurchase.dealer}</div>
          </div>
          

          <div className="flex justify-between items-center m-4">
            <div className="text-xl ">  Product :</div>
            <div className=" text-xl mr-4  text-gray-700"> {selectedPurchase.Product.item}</div>
          </div>

          <div className="flex justify-between items-center m-4">
            <div className="text-xl "> Payment Method :</div>
            <div className=" text-xl mr-4  text-gray-700"> {selectedPurchase.paymentType}</div>
          </div>

          <div className="flex justify-between items-center m-4">
            <div className="text-xl ">  Rate :</div>
            <div className=" text-xl mr-4  text-gray-700"> {selectedPurchase.rate}</div>
          </div>

          <div className="flex justify-between items-center m-4">
            <div className="text-xl ">  Quantity :</div>
            <div className=" text-xl mr-4  text-gray-700"> {selectedPurchase.quantity}</div>
          </div>


          <div className="m-4">
            <div className="text-xl "> Description : </div>
            <div className=" text-xl mr-4   break-words text-justify text-gray-700 "> {selectedPurchase.description}</div>
          </div>
          <div className="flex justify-between items-center m-4 mt-5 border-t-2 border-gray-700">
            <div className="text-xl mt-2"> {"Sub Total (excl. gst)"}</div>
            <div className=" text-xl mr-4 mt-2  text-gray-700"> {selectedPurchase.total_amount}</div>
          </div>
          <div className="flex justify-between items-center m-4 border-gray-700">
          <div className="text-xl mt-2">GST :</div>

            <div className=" text-xl mr-4 mt-2  text-gray-700"> { selectedPurchase.gstRate}</div>
          </div>
          <div className="flex justify-between items-center m-4 mt-5 border-t-2 border-gray-700">
            <div className="text-xl mt-2">Total amount</div>
            <div className=" text-xl mr-4 mt-2  text-gray-700"> {selectedPurchase.total_amount_postGst}</div>
          </div>




        </div>
      </div>
    )}
 



    <div className="grid grid-cols-12 bg-gray-100 p-14 border-t-2 border-b-2 border-supabaseGray-light">




      <div className={`flex flex-col justify-start text-3xl col-span-3  bg-gradient-to-l from-teal-600 to-teal-800 rounded-xl  text-white px-4 py-2.5 hover:scale-105 transition-transform duration-200`}>
        <div className="text-xl font-light  text-white p-3">
          <h2>Gross Purchase Value</h2>
        </div>
        <div className="font-normal text-3xl pl-5">
          <h2> <FontAwesomeIcon icon={faIndianRupeeSign} />{"  " + totalamount}</h2>
        </div>
      </div>
      <div className="col-span-3 ml-6">


      <div className={`flex flex-col justify-start text-3xl col-span-3  bg-gradient-to-l from-teal-600 to-teal-800 rounded-xl  text-white px-4 py-2.5 hover:scale-105 transition-transform duration-200`}>
        <div className="text-xl font-light  text-white p-3">
          <h2>Total Purchase Value</h2>
        </div>
        <div className="font-normal text-3xl pl-5">
          <h2> <FontAwesomeIcon icon={faIndianRupeeSign} />{"  " + total_amount_postGst}</h2>
        </div>
      </div>
      
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

        <div className="text-lg mr-10 " onClick={navigatetoform}>
          <button type="button" className="py-3.5 px-5 me-2 mb-2 text-md font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-teal-800 dark:text-white  dark:hover:text-white dark:hover:bg-gray-700"><FontAwesomeIcon icon={faPlus} className="text-lg" /> Add Purchase</button>
        </div>

      </div>
    </div>

    <div className="p-6 bg-gray-100 min-h-screen">
      <div className=" flex justify-center bgiwhite rounded-lg shadow-lg p-4 mb-6 text-gray-950 ">
        
        <div className="flex-1 mx-2">
          <h2 className="text-xl font-semibold">Date</h2>

        </div>
        <div className="flex-1 mx-2">
          <h2 className="text-xl font-semibold">Vendor</h2>

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
          <h2 className="text-xl font-semibold">Total Amount</h2>
        </div>
      </div>

      {filteredPurchase.map((purchase, index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-white hover:bg-blue-300 hover:bg-opacity-30 rounded-lg shadow-lg p-4 mb-6 text-gray-800"
          onClick={() => {
            setSelectedPurchase(purchase)
            setRenderPurchaseInfo(true)
          }} >
          
          <div className="flex-1 mx-2">
            <h2 className="text-lg font-semibold">
              <p>{new Date(purchase.date).toLocaleDateString('en-CA')}</p>
            </h2>
          </div>
          <div className="flex-1 mx-2">
            <h2 className="text-lg font-semibold">
              <p><FontAwesomeIcon icon={faBuilding} />{" " + purchase.dealer}</p>
            </h2>
          </div>
          <div className="flex-1 mx-2">
            <h2 className="text-lg font-semibold">

              <p>{purchase.Product.item}</p>
            </h2>
          </div>
          <div className="flex-1 mx-2">
            <h2 className="text-lg font-semibold">

              <p><FontAwesomeIcon icon={faIndianRupeeSign} />{"  " + purchase.rate}</p>
            </h2>
          </div>
          <div className="flex-1 mx-2">
            <h2 className="text-lg font-semibold">

              <p>{purchase.quantity}</p>
            </h2>
          </div>
          <div className="flex-1 mx-2">
            <h2 className="text-lg font-semibold">

              <p><FontAwesomeIcon icon={faIndianRupeeSign} />{"  " + purchase.total_amount_postGst}</p>
            </h2>
          </div>
        </div>
      ))}
    </div>
  </div>
}

export default PurchaseList;
