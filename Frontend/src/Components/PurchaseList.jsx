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
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/purchase/${uid}/${companyid}`)
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

      const DeletePurchase = await axios.delete(`${import.meta.env.VITE_BACKEND_BASE_URL}/purchase/${uid}/${companyid}/${selectedPurchase.billing_number}
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

      
      const updatePurchase = await axios.put(`${import.meta.env.VITE_BACKEND_BASE_URL}/purchase/${companyid}/${selectedPurchase.billing_number}` ,{
        
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

  return (
    <div className="min-h-screen bg-gray-50">
     <div className=" sticky z-20 border-b-2 top-0 bg-white h-16 text-supabaseGray-dark text-2xl flex items-center justify-center lg:justify-start ">
        <div className="w-1/4  ml-5"> Purchases </div>
       
      </div>

      {DeleteBox && (
        <div className="fixed inset-0 z-50 h-screen flex justify-center items-center bg-black bg-opacity-50">
          <div className="text-center bg-white p-4 sm:p-5 rounded-lg shadow-lg w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3">
            <div className="mb-4 sm:mb-5">
            </div>
            <h2 className="text-lg sm:text-xl mb-4">Are you sure you want to delete this Purchase</h2>
            <button
              className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded mr-2 hover:opacity-90"
              onClick={handleDelete}
            >
              Yes
            </button>
            <button
              className="bg-blue-500 hover:opacity-90 text-white px-3 sm:px-4 py-2 rounded mr-2"
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
        <div className="absolute z-50 inset-0 h-screen w-full flex justify-center items-center bg-black bg-opacity-50 transition duration-300 ease-in-out"
          ref={modalRef}  
          onKeyDown={(e)=>{
            if(e.key === "Enter"){
              handleconfirm()
            }
            if(e.key === "Escape"){
              handlecancel()
            }
          }}
          tabIndex="0">
          <div className="text-center bg-white p-4 sm:p-5 rounded-lg shadow-lg w-11/12 sm:w-96">
            <h2 className="text-lg sm:text-xl mb-4">Are you sure you want to update this purchase?</h2>
            <button
              className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded mr-2 hover:opacity-90"
              onClick={handleconfirm}
            >
              Yes
            </button>
            <button
              className="bg-blue-500 hover:opacity-90 text-white px-3 sm:px-4 py-2 rounded mr-2"
              onClick={handlecancel}
            >
              No
            </button>
          </div>
        </div>
      )}

      {renderPurchaseInfo && (
        <div className={`fixed inset-0 z-50 h-screen bg-black bg-opacity-30 transition-transform duration-300 ${isClosing ? "animate-fadeOut" : "animate-fadeIn"}`}>
          <div className={`fixed z-30 top-0 right-0 h-screen bg-white overflow-y-auto overflow-x-hidden shadow-lg ${isClosing ? "animate-slideOut" : "animate-slideIn"}`} style={{ width: "100%", maxWidth: "500px"}}>
            <div className="text-xl  m-4 top-0 right-0 fixed hover:bg-gray-200 hover:bg-opacity-5 hover:text-red-500 cursor-pointer mr-5 mt-3 w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center" onClick={() => {
              handleanimating(setRenderPurchaseInfo)
            }}><FontAwesomeIcon icon={faMultiply} /></div>
            
            <div className="text-xl sm:text-xl text-center mt-8 sm:mt-10">Purchase</div>

            <div className="flex justify-between items-center m-3 sm:m-4">
              <div className="text-base sm:text-md">Purchase Date:</div>
              <div className="text-base sm:text-md ml-4 text-gray-700">{new Date(selectedPurchase.date).toLocaleDateString('en-CA')}</div>
            </div>

            <div className="flex justify-between items-center m-3 sm:m-4">
              <div className="text-base sm:text-md">Invoice No.:</div>
              <div className="text-base sm:text-md mr-4 text-gray-700">{selectedPurchase.billing_number}</div>
            </div>

            <div className="flex justify-between items-center m-3 sm:m-4">
              <div className="text-base sm:text-md">Vendor:</div>
              <div className="text-base sm:text-md mr-4 text-gray-700">{selectedPurchase.dealer}</div>
            </div>

            <div className="flex justify-between items-center m-3 sm:m-4">
              <div className="text-base sm:text-md">Product:</div>
              <div className="text-base sm:text-md mr-4 text-gray-700">{selectedPurchase.Product.item}</div>
            </div>

            <div className="flex justify-between items-center m-3 sm:m-4">
              <div className="text-base sm:text-md">Payment Method:</div>
              <div className="text-base sm:text-md mr-4 text-gray-700">{selectedPurchase.paymentType}</div>
            </div>

            <div className="flex justify-between items-center m-3 sm:m-4">
              <div className="text-base sm:text-md">Rate:</div>
              <div className="text-base sm:text-md mr-4 text-gray-700">{selectedPurchase.rate}</div>
            </div>

            <div className="flex justify-between items-center m-3 sm:m-4">
              <div className="text-base sm:text-md">Quantity:</div>
              <div className="text-base sm:text-md mr-4 text-gray-700">{selectedPurchase.quantity}</div>
            </div>

            <div className="m-3 sm:m-4">
              <div className="text-base sm:text-md">Description:</div>
              <div className="text-base sm:text-md mr-4 break-words text-justify text-gray-700">{selectedPurchase.description}</div>
            </div>

            <div className="flex justify-between items-center m-3 sm:m-4 mt-5 border-t-2 border-gray-700">
              <div className="text-base sm:text-md mt-2">Sub Total (excl. gst)</div>
              <div className="text-base sm:text-md mr-4 mt-2 text-gray-700">{selectedPurchase.total_amount}</div>
            </div>

            <div className="flex justify-between items-center m-3 sm:m-4 border-gray-700">
              <div className="text-base sm:text-md mt-2">GST:</div>
              <div className="text-base sm:text-md mr-4 mt-2 text-gray-700">{selectedPurchase.gstRate}</div>
            </div>

            <div className="flex justify-between items-center m-3 sm:m-4 mt-5 border-t-2 border-gray-700">
              <div className="text-base sm:text-md mt-2">Total amount</div>
              <div className="text-base sm:text-md mr-4 mt-2 text-gray-700">{Math.round(selectedPurchase.total_amount_postGst).toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-teal-600 to-teal-800 hover:bg-gradient-to-l rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-lg font-light mb-4">Gross Purchase Value</h2>
            <p className="text-2xl font-semibold">
              <FontAwesomeIcon icon={faIndianRupeeSign} className="mr-2" />
              {Math.round(totalamount).toLocaleString()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-teal-600 to-teal-800 hover:bg-gradient-to-l rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-lg font-light mb-4">Total Purchase Value</h2>
            <p className="text-2xl font-semibold">
              <FontAwesomeIcon icon={faIndianRupeeSign} className="mr-2" />
              {Math.round(total_amount_postGst).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="w-full md:w-2/3">
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="search"
                className="w-full pl-12 pr-4 py-2.5 text-lg rounded-full border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200"
                placeholder="Search purchases..."
                value={search}
                onChange={handleonSearch}
              />
            </div>
          </div>

          <button
            onClick={navigatetoform}
            className="w-full md:w-auto px-4 py-2.5 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors duration-200 flex items-center justify-center gap-2 text-lg"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Purchase
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 border-b text-sm font-medium text-gray-600">
            <div>Date</div>
            <div>Vendor</div>
            <div>Product</div>
            <div>Rate</div>
            <div>Quantity</div>
            <div>Amount</div>
          </div>

          {filteredPurchase.map((purchase, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedPurchase(purchase)
                setRenderPurchaseInfo(true)
              }}
              className="grid grid-cols-6 gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b text-gray-600"
            >
              <div>{new Date(purchase.date).toLocaleDateString('en-CA')}</div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                {purchase.dealer}
              </div>
              <div>{purchase.Product.item}</div>
              <div>
                <FontAwesomeIcon icon={faIndianRupeeSign} className="mr-1" />
                {purchase.rate}
              </div>
              <div>{purchase.quantity}</div>
              <div>
                <FontAwesomeIcon icon={faIndianRupeeSign} className="mr-1" />
                {Math.round(purchase.total_amount_postGst).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PurchaseList;
