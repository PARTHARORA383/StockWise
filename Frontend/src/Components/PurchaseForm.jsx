import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UseRawmaterial from "../Hooks/UseRawmaterial";
import { useCompany } from "./Companycontext";
import useCreateRawmaterial from "../Hooks/useCreateRawmaterial";
import CustomDatePicker from "./DatePicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createPortal } from "react-dom";

import { faGreaterThan, faMinus, faMultiply, faPlus } from "@fortawesome/free-solid-svg-icons";
import Dealer from "../Hooks/useDealer";


const PurchaseForm = () => {
  const [billingNumber, setBillingNumber] = useState("");
  const [dealer, setDealer] = useState("");
  const [category, setCategory] = useState("")
  const [item, setItem] = useState("")
  const [description, setDescription] = useState("")
  const [paymentType, setPaymentType] = useState("Cash")
  const [gstRate, setGstRate] = useState("5")
  const [isCustomGst, setisCustomGst] = useState(false)
  const [isLoading, setIsLoading] = useState(false);

  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");
  const [isFocused, setisFocused] = useState("");
  const [Vendorslist, setVendorList] = useState([])

  const { selectedrawmaterial, setSelectedrawmaterial, selectedDates, setSelectedDates, vendor, setVendor, showProductList, setShowProductList } = useCompany();
  const { selectedsubrawmaterial, setSelectedsubrawmaterial } = useCompany();

  const [showDealerList, setShowDealerList] = useState(false);
  const [confirmationbox, setConfirmationbox] = useState(false)
  const [AddMorePurchase, setAddMorePurchase] = useState(false)
  const [DatePickertrue, setDatePickertrue] = useState(false)
  
  const [showAddRawmaterial, setShowAddRawmaterial] = useState(false);
  const [createcategory, setCreateCategory] = useState("");
  const [FreightCharge , setFreightCharge] = useState(0);
  const[FreightName , setFreightName] = useState("")
  const[gstFreight , setGstFreight] = useState(5)

  const { companyid, uid } = useParams();


  const { fetchRawMaterials, addRawMaterial, rawmaterial, categories, rawmaterialid, submaterial, FetchParticularRawmaterial } = useCreateRawmaterial(uid, companyid)

  // Create refs for input fields

  const dealerRef = useRef(null);
  const purchasRef = useRef(null)
  const itemRef = useRef(null);
  const rateRef = useRef(null);
  const quantityRef = useRef(null);
  const categoryref = useRef(null);
  const billingNumberref = useRef(null);
  const descriptionRef = useRef(null);
  const freightNameRef = useRef(null);
  const freightChargeRef = useRef(null);

  const ExpenseRef = useRef(null);
  const modalRef = useRef(null)
  const handleonkeydown = (e, nextRef, prevRef) => {
    if (e.key == 'Enter') {
      e.preventDefault()
      nextRef.current.focus()
    }
    else if (e.key === 'Backspace' && e.target.value === '') {
      e.preventDefault();
      prevRef.current?.focus();
    }

  }
  

  const AddExpense = async () => {
    try {

      
    const requestbody = {
      date : selectedDates,
      expensename : FreightName,
      expenseAmount : FreightCharge,
      paymentType : "Purchase",
      description : "Freight Charges" 
    }


      const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/Expense/${uid}/${companyid}`, requestbody , {
        headers : {
          "Content-Type" : "application/json"
        }
      })
     
 

      if (response.status === 200) {
        console.log("Freight expense added successfully");
      }
    } catch (error) {
      console.error("Error adding freight expense:", error);
    }
  };

  const navigate = useNavigate();

  //Adding Purchase
  const AddPurchase = async () => {
    try {
      console.log("Purhcase form selected date is " + selectedDates)
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/purchase/${uid}/${companyid}`, {
        billing_number: billingNumber,
        Product: {
          category: selectedrawmaterial?.catogory || category,
        },
        dealer: vendor?.name || dealer,
        quantity: Number(quantity),
        rate: Number(rate),
        total_amount: Number(quantity) * Number(rate),
        date: selectedDates,
        paymentType: paymentType,
        gstRate: gstRate,
        description: description,
      });



      console.log(response.data);

      if (response.status == 200) {
        alert("Purchase added successfully!");
        
        setAddMorePurchase(true)
         AddtoInventory();
      }
    } catch (e) {
      console.error("Error adding purchase:", e);
      alert("Failed to add purchase. Please try again.");
    }
  };

 




  const handleFetchvendors = async () => {

    const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/vendor/${uid}/${companyid}`)
    setVendorList(response.data.fetchVendors)
    console.log("vendors are " + Vendorslist)

  }

  useEffect(() => {
    handleFetchvendors()
  }, [companyid])


  // //Adding to Inventory
  const AddtoInventory = async ()=>{
  console.log(selectedrawmaterial._id)
   try{
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_BASE_URL}/rawmaterial/${uid}/${companyid}/${selectedrawmaterial._id}` , {
     updatedquantity : parseInt(quantity)
   })

  if(response.status == 200){
      setSelectedrawmaterial();
       setAddMorePurchase(true)
   }

 }catch(e){
 alert("Error updating inventory")
  }
   }

  const handleconfirm = () => {
    AddPurchase()
    setConfirmationbox(false)

  }

  const handlecancel = () => {
    setConfirmationbox(false)
  }

  useEffect(() => {
    // When the confirmation box appears, set focus on the modal
    if (confirmationbox) {
      modalRef.current?.focus();
    }
    if (AddMorePurchase) {
      purchasRef.current?.focus()
    }
  }, [confirmationbox, AddMorePurchase]);



  const resetform = () => {
    setBillingNumber("")
    setDealer("")
    setCategory('')
    setItem('')
    setSelectedrawmaterial(null)
    setSelectedsubrawmaterial(null)
    setRate('')
    setQuantity('')

  }

  const handleaddmorepurchase = () => {
    setAddMorePurchase(false)
    resetform()
    fetchRawMaterials()
  }

  const handlenotaddpurchase = () => {
    navigate(`/Purchase/${uid}/${companyid}`)
  }



  const qualitycounterplus = () => {
    setQuantity(Number(quantity) + 1)
  }



  const qualitycounterminus = () => {
    if (quantity > 0) {
      setQuantity(Number(quantity) - 1)

    }
  }



  const selectSubMaterial = ( rawmaterial) => {
    setSelectedrawmaterial(rawmaterial);
    setShowProductList(false)
  };

   const renderAddRawmaterialModal = () =>
      createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          
            <div className="bg-white w-1/2 p-8 rounded-lg shadow-lg">
            <div className="flex justify-end">
              <button 
                onClick={() => setShowAddRawmaterial(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faMultiply} className="text-xl" />
              </button>
            </div>
        
            <h2 className="text-lg mb-6 text-center">Add Raw Material</h2>
  
            <div className="mb-4 flex items-center">
              <label className="text-lg w-1/3">Raw Material:</label>
              <input
                className="text-lg rounded-lg border-gray-300 p-3 w-2/3"
                placeholder=" Create a raw material"
                list="category-list"
                value={createcategory}
                onChange={(e) => setCreateCategory(e.target.value)}
              />
          
            </div>
  
           
  
            <div className="text-center mt-6">
            




<button
  onClick={async () => {
    setIsLoading(true);
    try {
      await addRawMaterial(createcategory);
      await fetchRawMaterials();
      setShowAddRawmaterial(false);
    } catch (error) {
      console.error("Error adding raw material:", error);
    } finally {
      setIsLoading(false);
    }
  }}
  disabled={isLoading}
  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg"
>
  {isLoading ? (
    <div className="flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
      Adding...
    </div>
  ) : (
    'Save'
  )}
</button>
            </div>
          </div>
        </div>,
        document.body
      );



  return (<div className="relative z-10">



    <div className="h-full bg-gray-100">

    {showAddRawmaterial && renderAddRawmaterialModal()}

      <div></div>
      <div className=" sticky z-20 border-b-2 top-0 bg-white h-16 text-supabaseGray-dark text-2xl flex items-center justify-between">
        <div className="w-1/4 ml-16 lg:ml-5">Add Purchase</div>
        <div className=" lg:w-1/5 w-1/3 text-center mr-2 ">

          <button
            onClick={() => { setConfirmationbox(true) }}
            className="bg-blue-500 hover:bg-blue-600 text-white text-lg lg:py-1.5 py-0.5  rounded-lg shadow-md  transition duration-300  w-full "
          >
            Add Purchase
          </button>
        </div>
      </div>




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
            <h2 className="text-lg mb-4">Are you sure you want to add this purchase?</h2>
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


      {AddMorePurchase && (
        <div className="absolute z-50 inset-0 h-screen w-full flex justify-center items-center bg-black bg-opacity-50 transition duration-300 ease-in-out  "
          ref={purchasRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleaddmorepurchase()
            }
            if (e.key === "Escape") {
              handlenotaddpurchase()
            }
          }}
          tabIndex="0" >
          <div className=" text-center bg-white p-5 rounded-lg shadow-lg w-96" >
            <h2 className="text-lg mb-4">Do you want to add more Purchase</h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:opacity-90"
              onClick={handleaddmorepurchase}
            >
              Yes
            </button>
            <button
              className="bg-blue-500 hover:opacity-90 text-white px-4 py-2 rounded mr-2"
              onClick={handlenotaddpurchase}
            >
              No
            </button>


          </div>
        </div>
      )}


      {//PurchaseForm Component
      }

      <div className="grid grid-cols-12 h-full  border-r-2 bg-gray-100  pb-24 pt-10 pr-2 pl-2  lg:ml-10 lg:pr-20">

        {
          //Pop up Form
        }
        <div className=" lg:col-span-10 col-span-12 relative bg-white shadow-lg rounded-lg p-4 lg:p-10 flex flex-col w-full  inset-0 mt-4" style={{ height: "100%"  , maxHeight: "720px" }}>

          <div className="text-2xl "> Register Purchase</div>
          <div className="lg:text-lg text-md mb-10 text-gray-500"> Easily register your daily purchases to keep your inventory updated</div>
          <div className=" absolute top-0 right-0  mt-28 lg:mt-24 mr-2 flex lg:w-52 ">
            <CustomDatePicker />
          </div>


          <div className="mt-5 w-full mb-4 items-center space-y-2">
            <label className="text-gray-700 lg:text-lg text-md font-medium  ">
              Bill Number :
            </label>
            <input
              ref={billingNumberref}
              className={`lg:text-lg text-md w-full rounded-lg border-gray-200  border p-2 mt-2 focus:outline-blue-300 focus:ring-blue-500 ${billingNumber.length > 0 ? 'bg-gray-300 bg-opacity-20 ' : 'bg-white'}`}
              id="billingNumber"
              value={billingNumber}
              placeholder="Enter Bill Number"
              onChange={(e) => setBillingNumber(e.target.value)}
              onFocus={() =>
                setShowProductList(false)
              }
              onBlur={() => { setisFocused("") }}
              onKeyDown={(e) => { handleonkeydown(e, dealerRef, null) }}
              required
            />
          </div>


          <div className=" mt-2 w-full mb-4 items-center space-y-2">
            <label className="lg:text-lg text-md text-gray-700 font-medium mb-1 ">Vendor :</label>
            <input

              className={`lg:text-lg text-md w-full rounded-lg border-gray-200 border p-2 focus:outline-blue-300 focus:ring-blue-500 ${isFocused === 'dealer' ? "bg-blue-300" : "bg-white"} ${dealer.length > 0 ? 'bg-gray-300 bg-opacity-20' : 'bg-white'}`}
              id="Dealer"
              ref={dealerRef}
              value={vendor?.name || dealer}
              placeholder="Enter Dealer Name"
              onClick={handleFetchvendors}
              onChange={(e) => {
                setDealer(e.target.value)

              }
              }
              onFocus={() => {
                setisFocused("dealer")
                setShowDealerList(true)
                setShowProductList(false)

              }}
              onBlur={() => { setisFocused("") }}
              onKeyDown={(e) => { handleonkeydown(e, categoryref, billingNumberref) }}
            />
          </div>


          <div className="w-full mb-4 ">


            <div className="flex flex-col  lg:space-x-20 w-full items-center lg:justify-between">

              <div className=" flex flex-col space-y-2  w-full ">

                <label className="lg:text-lg text-md ">Category :</label>

                <input
                  ref={categoryref}
                  className={`lg:text-lg text-md  rounded-lg border-gray-200  border p-2 focus:border-blue-500 focus:ring-1 focus : outline-blue-300 ${selectedrawmaterial ? "bg-gray-300 bg-opacity-20 " : "bg-white  "}`}
                  id="Product"
                  value={selectedrawmaterial?.catogory || category}
                  placeholder="Select Rawmaterial"

                  onFocus={() => {
                    setisFocused(true)
                    setShowDealerList(false)
                    setShowProductList(true)

                  }}

                  onBlur={() => {
                    setisFocused(false)


                  }}

                  onChange={(e) => {
                    setCategory(e.target.value), setSelectedrawmaterial()
                  }
                  }
                  onKeyDown={(e) => { handleonkeydown(e, rateRef, dealerRef) }}
                />
              </div>

        
            </div>
          </div>

          <div className="w-full mb-4 items-center space-y-2">
            <label className="block text-gray-700 font-medium mb-1 w-1/3 lg:text-lg text-md">Rate :</label>
            <input
              className={`lg:text-lg text-md w-full rounded-lg border-gray-200 border p-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${rate.length > 0 ? "bg-gray-300 bg-opacity-20" : "bg-white"}`}
              ref={rateRef}
              id="Rate"
              value={rate}
              placeholder="Enter Rate"
              onChange={(e) => setRate(e.target.value)}
              onFocus={() => {

                setisFocused(true)
                setShowProductList(false)
                setShowDealerList(false)
              }
              }
              onBlur={() => { setisFocused(false) }}
              onKeyDown={(e) => { handleonkeydown(e, quantityRef, itemRef) }}
            />
          </div>
          <div className=" flex w-2/3 mb-6  items-center">
            <label className="block text-gray-700 font-medium mb-1  lg:text-lg text-md">
              Quantity :
            </label>
            <div className=" flex items-center justify-center">

              <input
                className={`lg:text-lg text-md w-1/2 rounded-lg border-gray-200  border p-2 ml-5 mr-5 focus:border-blue-500 focus:outline-none focus:ring-blue-500${quantity.length > 0 ? " bg-blue-300 bg-opacity-20" : "bg-white"} `}
                ref={quantityRef}
                id="quantity"
                value={quantity}
                placeholder="Enter Quantity"
                onChange={(e) => setQuantity(e.target.value)}
                onKeyDown={(e) => {
                  handleonkeydown(e, freightNameRef, rateRef)
                }}

              />
              <div className="flex space-x-3">
                <div className="bg-teal-600 hover:bg-teal-800 active:bg-teal-700 rounded-full h-10 w-10 flex items-center justify-center transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95" onClick={qualitycounterminus} >
                  <FontAwesomeIcon icon={faMinus} className="lg:text-lg text-md text-white" />
                </div>
                <div className="bg-teal-600 hover:bg-teal-800 active:bg-teal-700 rounded-full h-10 w-10 flex items-center justify-center transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95" onClick={qualitycounterplus}>
                  <FontAwesomeIcon icon={faPlus} className="lg:text-lg text-md text-white" />
                </div>
              </div>

            </div>
          </div>


        </div>

        <div className=" mt-4 lg:col-span-10 col-span-12 bg-white shadow-lg rounded-lg p-4 lg:p-10 flex inset-0 space-x-4 items-center  " style={{ height: "100px" }}>
          <div className="lg:text-lg text-md font-medium">Payment Method :</div>
          <select className="lg:text-lg text-md bg-supabaseGray-light text-white  w-1/6 text-center h-10 rounded-lg" value={paymentType}
            onChange={(e) => {
              setPaymentType(e.target.value)
            }}>
            <option>Cash</option>
            <option>Online</option>
          </select>
        </div>
        <div className=" mt-4 lg:col-span-10 col-span-12 bg-white shadow-lg rounded-lg p-4 lg:p-10 flex flex-col inset-0  space-y-2 justify-center items-start" style={{ height: "150px" }}>
          <div className="lg:text-lg text-md font-medium"> GST:</div>
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
     

        <div className="mt-4 lg:col-span-10 col-span-12 bg-white shadow-lg rounded-lg p-4 lg:p-10 flex  flex-col inset-0  justify-start items-start  space-y-2 " style={{ height: "250px" }}>
          <div className="lg:text-lg text-md font-medium">Description</div>
          <textarea
            className={`lg:text-lg text-md w-full rounded-lg border-gray-200  border p-2 mr-5 focus:border-blue-500 focus:outline-none focus:ring-blue-500 h-52 ${description.length > 0 ? " bg-blue-300 bg-opacity-20" : "bg-white"} `}
            ref={descriptionRef}
            id="description"
            value={description}
            placeholder="Enter Description"
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => {
              handleonkeydown(e, null, freightChargeRef)
            }}

          />
        </div>
        <div className="col-span-12 lg:col-span-10 rounded-lg pt-6 flex items-center justify-end">


          <button
            onClick={() => { setConfirmationbox(true) }}
            className="bg-blue-500 hover:bg-blue-600 text-white lg:text-lg text-md py-2 rounded-lg shadow-lg  transition duration-300  w-1/4"
          >
            Add Purchase
          </button>
        </div>
      </div>





      {showProductList && (

        <div className="fixed inset-0 bg-black bg-opacity-30 z-30">
          <div className=" lg:block  h-full bg-white  shadow-md  lg:w-1/4  transition delay-300 ease-in-out overflow-y-auto fixed right-0 top-15 z-50 pb-1 animate-slideIn" style={{width : "400px"}}>
            {/* This side section can display accounts or other relevant information */}
            <div className="text-2xl m-4 top-0 right-0 fixed hover:bg-gray-200 hover : bg-opacity-5 hover:text-red-500 cursor-pointer lg:mr-5 lg:mt-3 m-2 mb-4 w-10 h-10 flex items-center justify-center  " onClick={() =>
              setShowProductList(false)

            } ><FontAwesomeIcon icon={faMultiply} />


            </div>
            <div className="ml-10 mb-4 mt-14 h-11  bg-blue-500 hover:bg-blue-700  rounded-xl flex items-center justify-center text-lg text-white cursor-pointer" style={{ width: "300px" }} onClick={()=>{
              setShowAddRawmaterial(true)
            }}>
              <FontAwesomeIcon icon={faPlus} className="mr-2"/>
              Create a New Rawmaterial
            </div>

            {rawmaterial.length > 0 ? (
              <div>
                {rawmaterial.map((item) => (
                  <div className="bg-white shadow-md overflow-hidden" key={item._id}>
                    <div className="bg-gradient-to-tr hover:bg-blue-300 m-2 hover:bg-opacity-30 text-gray-800 rounded-lg lg:text-lg text-md p-2" onClick={()=>{
                      selectSubMaterial(item)
               
                     
                    }}>
                      {item.catogory}
                    </div>
               
                  </div>
                ))}
              </div>
            ) : (
              <div className="lg:text-lg text-md text-center">
                Please create a rawmaterial to continue
              </div>
            )
            }
          </div>
        </div>
      )}

      {showDealerList && (
        <div className="bg-black fixed inset-0 bg-opacity-30 z-50">
          <div className=" lg:block h-full bg-white shadow-md   lg:w-1/4 transition delay-300 ease-in-out overflow-y-auto fixed right-0 top-15 z-50 pb-16 animate-slideIn">
            <div className="text-2xl text-supabaseGray-dark m-4 text-bold mt-6 text-center"> Vendors</div>
            <div className="text-2xl m-4 top-0 right-0 fixed hover:bg-gray-200 hover : bg-opacity-5 hover:text-red-500 cursor-pointer mr-5 mt-3 w-10 h-10 flex items-center justify-center  " onClick={() => {
              setShowDealerList(false)

            }} ><FontAwesomeIcon icon={faMultiply} />
            </div>
            <div className="ml-10 mb-4 h-12 bg-blue-500 hover:bg-blue-700  rounded-xl flex items-center justify-center text-lg text-white cursor-pointer" style={{ width: "400px" }}>
              <FontAwesomeIcon icon={faPlus} className="mr-2" onClick={() => {
                navigate(`/Vendors/${uid}/${companyid}`, { state: { from: `/PurchaseForm/${uid}/${companyid}` } })
              }} />
              Create a New Vendor


            </div>
            {Vendorslist.length > 0 ? (
              <div>
                {Vendorslist.map((vendor) => (
                  <div className="bg-gradient-to-tr  text-black lg:text-lg text-md  p-4 hover:bg-blue-300 hover:bg-opacity-30 " key={vendor._id} onClick={(

                  ) => {
                    setVendor(vendor)
                    setShowDealerList(false)
                  }}>
                    {vendor.name}
                  </div>
                ))}
              </div>
            ) : (<div className="text-supabaseGray-light lg:text-lg text-md text-center mt-6">Please Add a Vendor To continue</div>)}
          </div>
        </div>
      )}
    </div>
  </div>
  );
};



export default PurchaseForm;