import axios from "axios";
import { useState ,useRef  , useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import UseRawmaterial from "../Hooks/UseRawmaterial";
import { useCompany } from "./Companycontext";



const PurchaseForm = () => {
  const [billingNumber, setBillingNumber] = useState("");
  const [dealer, setDealer] = useState("");
  const [category , setCategory] = useState("")
  const [item , setItem] = useState("")

  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");
  const [isFocused, setisFocused] = useState("");

  const { selectedrawmaterial, setSelectedrawmaterial } = useCompany();
  const { selectedsubrawmaterial, setSelectedsubrawmaterial } = useCompany();
  const [showProductList, setShowProductList] = useState(false);
  const [showDealerList, setShowDealerList] = useState(false);
  const[confirmationbox , setConfirmationbox] = useState(false)

  const { companyid } = useParams();

   // Create refs for input fields

   const dealerRef = useRef(null);
   
   const itemRef = useRef(null);
   const rateRef = useRef(null);
   const quantityRef = useRef(null);
   const modalRef = useRef(null)
   const handleonkeydown = (e , nextRef)=>{
    if(e.key == 'Enter'){
      e.preventDefault()
      nextRef.current.focus()
    }

   }

  const navigate = useNavigate();
  const AddPurchase = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/purchase/${companyid}`, {
        billing_number: billingNumber,
        Product:{
          category : selectedrawmaterial?.catogory ||category ,
          item : selectedsubrawmaterial?.name || item
        },
        dealer: dealer,
        quantity: Number(quantity),
        rate: Number(rate),
        total_amount: Number(quantity) * Number(rate),
      });
      console.log(response.data);

      if(response.status == 200){
      
        
        alert("Purchase added successfully!");
       AddtoInventory();
      }
    } catch (e) {
      console.error("Error adding purchase:", e);
      alert("Failed to add purchase. Please try again.");
    }
  };

  const AddtoInventory = async ()=>{

  try{
    const response = await axios.put(`http://localhost:3000/rawmaterial/${companyid}/${selectedrawmaterial._id}/${selectedsubrawmaterial._id}` , {
      updatedquantity : parseInt(quantity)
    })

    if(response.status == 200){
      setSelectedrawmaterial();
      setSelectedsubrawmaterial();
      navigate(`/Purchase/${companyid}`)

    }

      
  }catch(e){
alert("Error updating inventory")
  }
  }

  const handleconfirm = ()=>{
    AddPurchase()
    setConfirmationbox(false)

  }

  const handlecancel = ()=>{
    setConfirmationbox(false)
  }

  useEffect(() => {
    // When the confirmation box appears, set focus on the modal
    if (confirmationbox) {
      modalRef.current?.focus();
    }
  }, [confirmationbox]);

  return (<div className=" ml-8 z-10">

    <div className="h-14 border-b-2 border-black text-xl flex items-center p-2">
      Stocks
    </div>
   

    <div className=" grid grid-cols-12 h-full bg-gray-100">


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


      {//PurchaseForm Component 
      }

      <div className=" fixed w-2/3 col-span-full lg:col-span-9 h-full flex justify-center items-center border-r-2 bg-gray-200 z-10 ">

          {
            //Pop up Form
          }
        <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col w-3/4 inset-0 " style={{ height: "600px" }}>

        <div className=" text-center text-xl mb-10"> Register Your Daily Purchase</div>

          <div className=" flex w-full mb-4 items-center">
            <label className=" text-gray-700 text-lg font-medium mb-1 w-1/3">
              Bill Number :
            </label>
            <input
            
              className={`text-lg w-full rounded-lg border-gray-200  border p-3 focus:outline-none focus:ring-blue-500 ${billingNumber.length>0 ? 'bg-blue-300 bg-opacity-20' : 'bg-white'}`}
              id="billingNumber"
              value={billingNumber}
              placeholder="Enter Bill Number"
              onChange={(e) => setBillingNumber(e.target.value)}
              onFocus={() => setisFocused("billingNumber")}
              onBlur={() => { setisFocused("") }} 
              onKeyDown={(e)=>{handleonkeydown(e , dealerRef)}}
              required
            />
          </div>


          <div className=" flex w-full mb-4 items-center">
            <label className="text-lg text-gray-700 font-medium mb-1 w-1/3">Vendor :</label>
            <input

              className={`text-lg w-full rounded-lg border-gray-200 border p-3 focus:outline-none focus:ring-blue-500 ${isFocused === 'dealer' ? "bg-blue-300" : "bg-white" } ${dealer.length > 0 ? 'bg-gray-300 bg-opacity-20' : 'bg-white'}`}
              id="Dealer"
              ref={dealerRef}
              value={dealer}
              placeholder="Enter Dealer Name"
              onChange={(e) => setDealer(e.target.value)}
              onFocus={() => {setisFocused("dealer")
                setShowDealerList(true)
                showProductList(false)
              }}
              onBlur={() => { setisFocused("") }}
              onKeyDown={(e)=>{handleonkeydown(e , itemRef)}}
            />
          </div>


          <div className="w-full mb-4">


            <label className="block text-gray-700 font-medium mb-1 text-lg">
              Product
            </label>

            <div className="flex space-x-4 items-center">

              <div className="flex items-center justify-normal w-1/2">

                <label className="text-lg w-1/3">Category :</label>

                <input
                  className={`text-lg  rounded-lg border-gray-200  border p-3 focus:border-blue-500 focus:ring-1 focus : outline-none focus:ring-blue-500  w-2/3 ${selectedrawmaterial ? "bg-gray-300 bg-opacity-20 " : "bg-white  " }`}
                  id="Product"
                  value={selectedrawmaterial?.catogory||category}
                  placeholder="Select Catogory"
                    onClick={()=>{setShowProductList(true)
                      setShowDealerList(false)
                    }}
                  onFocus={() => setisFocused(true)}
                  onBlur={() => { setisFocused(false) 
                

                   }}
                   onChange={(e)=>{setCategory(e.target.value)}}
                />
              </div>

              <div className="flex items-center  w-1/2" >
                <label className="text-lg w-1/3">Item :</label>
                <input
                  className={`text-lg w-2/3 rounded-lg border-gray-200 border  p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${selectedsubrawmaterial ? "bg-gray-300 bg-opacity-20" : "bg-white"}`}
                  id="Product"
                  ref={itemRef}
                  value={selectedsubrawmaterial?.name||item}
                  placeholder="Select Product"
                  onClick={()=>{setShowProductList(true) 
                   setShowDealerList(false)}}

                  onFocus={() => {setisFocused(true) 
                    setShowProductList(true)
                    setShowDealerList(false)
                  }}
                  onBlur={() => { setisFocused(false)
                    
                  }}
                  onKeyDown = {(e)=>{handleonkeydown(e , rateRef)}}
                  onChange={(e)=>{setItem(e.target.value)}}
                />
              </div>
            </div>
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
              onFocus={() => setisFocused(true)}
              onBlur={() => { setisFocused(false)}}
              onKeyDown={(e)=>{handleonkeydown(e,quantityRef)}}
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
              onKeyDown={(e)=>{
                if(e.key == 'Enter'){
                  setConfirmationbox(true);
                }
              }}
            
            />
          </div>
          <div className=" w-full text-center mt-5">

          <button
            onClick={()=>{setConfirmationbox(true)}}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg shadow-md w-1/3 transition duration-300"
            >
            Add Purchase
          </button>
            </div>
        </div>
      </div>
           
           {showProductList && (

             <div className="hidden lg:block col-span-3 h-full bg-white shadow-md  w-1/5 transition delay-300 ease-in-out overflow-y-auto fixed right-0 top-15 z-50 pb-1 ">
        {/* This side section can display accounts or other relevant information */}
        <UseRawmaterial />
        {/* Display product list or other data here */}
      </div>
      )}
           
           {showDealerList && (

             <div className="hidden lg:block col-span-3 h-full bg-white shadow-md  w-1/5 transition delay-300 ease-in-out overflow-y-auto fixed right-0 top-15 z-50 pb-16">
        {/* This side section can display accounts or other relevant information */}
        {/* Display product list or other data here */}
        Dealer
      </div>
      )}
    </div>
  </div>
  );
};



export default PurchaseForm;