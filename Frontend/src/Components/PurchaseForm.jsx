import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UseRawmaterial from "../Hooks/UseRawmaterial";
import { useCompany } from "./Companycontext";
import useCreateRawmaterial from "../Hooks/useCreateRawmaterial";
import CustomDatePicker from "./DatePicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

  const navigate = useNavigate();

  //Adding Purchase
  const AddPurchase = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/purchase/${uid}/${companyid}`, {
        billing_number: billingNumber,
        Product: {
          category: selectedrawmaterial?.catogory || category,
          item: selectedsubrawmaterial?.name || item
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
        await CreateSubmaterial();
        setAddMorePurchase(true)
        // AddtoInventory(rawmaterialid , submaterial);
      }
    } catch (e) {
      console.error("Error adding purchase:", e);
      alert("Failed to add purchase. Please try again.");
    }
  };

  const CreateSubmaterial = async () => {
    addRawMaterial(category, item, quantity)
    await fetchRawMaterials()
  }




  const handleFetchvendors = async () => {

    const response = await axios.get(`http://localhost:3000/vendor/${uid}/${companyid}`)
    setVendorList(response.data.fetchVendors)
    console.log("vendors are " + Vendorslist)

  }

  useEffect(() => {
    handleFetchvendors()
  }, [companyid])


  // //Adding to Inventory
  // const AddtoInventory = async (rawmaterialid , submaterial)=>{
  //   console.log(rawmaterialid , submaterial)
  // try{
  //   const response = await axios.put(`http://localhost:3000/rawmaterial/${uid}/${companyid}/${selectedrawmaterial._id || rawmaterialid}/${selectedsubrawmaterial._id || submaterial}` , {
  //     updatedquantity : parseInt(quantity)
  //   })

  //   if(response.status == 200){
  //     setSelectedrawmaterial();
  //     setSelectedsubrawmaterial();
  //     setAddMorePurchase(true)

  //   }

  // }catch(e){
  // alert("Error updating inventory")
  // }
  // }

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



  const selectSubMaterial = (submaterial, rawmaterial) => {
    setSelectedsubrawmaterial(submaterial);
    setSelectedrawmaterial(rawmaterial);
    setShowProductList(false)
  };

  return (<div className="relative ml-8 z-10">



    <div className="h-full bg-gray-100">

      <div></div>
<div className=" sticky z-20 border-b-2 top-0 bg-white h-16 text-supabaseGray-dark text-2xl flex items-center justify-between">
        <div className="w-1/4 ml-5">Add Purchase</div>
        <div className=" w-1/5 text-center mr-2">

          <button
            onClick={() => { setConfirmationbox(true) }}
            className="bg-blue-500 hover:bg-blue-600 text-white text-xl py-2 roun      ded-lg shadow-md  transition duration-300  w-full"
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
            <h2 className="text-xl mb-4">Do you want to add more Purchase</h2>
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

      <div className="grid grid-cols-12 h-full  border-r-2 bg-gray-200  pb-24 pt-10 pr-20 pl-10 ">

        {
          //Pop up Form
        }
        <div className=" col-span-10 relative bg-white shadow-lg rounded-lg p-10 flex flex-col w-full  inset-0 mt-14" style={{ height: "720px" }}>

          <div className="text-2xl "> Register Purchase</div>
          <div className="text-xl mb-10 text-gray-500"> Easily register your daily purchases to keep your inventory updated</div>
          <div className=" absolute top-0 right-0  mt-24 mr-2 flex w-52 ">
            <CustomDatePicker />
          </div>


          <div className="mt-5 w-full mb-4 items-center space-y-2">
            <label className="text-gray-700 text-xl font-medium  ">
              Bill Number :
            </label>
            <input
              ref={billingNumberref}
              className={`text-xl w-full rounded-lg border-gray-200  border p-3.5 mt-2 focus:outline-blue-300 focus:ring-blue-500 ${billingNumber.length > 0 ? 'bg-gray-300 bg-opacity-20 ' : 'bg-white'}`}
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
            <label className="text-xl text-gray-700 font-medium mb-1 ">Vendor :</label>
            <input

              className={`text-xl w-full rounded-lg border-gray-200 border p-3.5 focus:outline-blue-300 focus:ring-blue-500 ${isFocused === 'dealer' ? "bg-blue-300" : "bg-white"} ${dealer.length > 0 ? 'bg-gray-300 bg-opacity-20' : 'bg-white'}`}
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


            <div className="flex space-x-20 items-center">

              <div className=" flex flex-col space-y-2  w-1/2">

                <label className="text-xl w-1/3">Category :</label>

                <input
                  ref={categoryref}
                  className={`text-xl  rounded-lg border-gray-200  border p-3.5 focus:border-blue-500 focus:ring-1 focus : outline-blue-300 ${selectedrawmaterial ? "bg-gray-300 bg-opacity-20 " : "bg-white  "}`}
                  id="Product"
                  value={selectedrawmaterial?.catogory || category}
                  placeholder="Select Catogory"

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
                  onKeyDown={(e) => { handleonkeydown(e, itemRef, dealerRef) }}
                />
              </div>

              <div className=" flex flex-col space-y-2  w-1/2" >
                <label className="text-xl w-1/3">Item :</label>
                <input
                  className={`text-xl rounded-lg border-gray-200 border  p-3.5 focus:border-blue-500 focus:ring-1  focus:outline-blue-300 focus:ring-blue-500 ${selectedsubrawmaterial ? "bg-gray-300 bg-opacity-20" : "bg-white"}`}
                  id="Product"
                  ref={itemRef}
                  value={selectedsubrawmaterial?.name || item}
                  placeholder="Select Product"


                  onFocus={() => {
                    setisFocused(true)
                    setShowProductList(true)
                    setShowDealerList(false)
                  }}
                  onBlur={() => {
                    setisFocused(false)

                  }}
                  onKeyDown={(e) => { handleonkeydown(e, rateRef, categoryref) }}
                  onChange={(e) => { setItem(e.target.value), setSelectedsubrawmaterial() }}
                />
              </div>
            </div>
          </div>

          <div className="w-full mb-4 items-center space-y-2">
            <label className="block text-gray-700 font-medium mb-1 w-1/3 text-xl">Rate :</label>
            <input
              className={`text-xl w-full rounded-lg border-gray-200 border p-3.5 focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${rate.length > 0 ? "bg-gray-300 bg-opacity-20" : "bg-white"}`}
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
            <label className="block text-gray-700 font-medium mb-1  text-xl">
              Quantity :
            </label>
            <div className=" flex items-center justify-center">

              <input
                className={`text-xl w-1/2 rounded-lg border-gray-200  border p-3.5 ml-5 mr-5 focus:border-blue-500 focus:outline-none focus:ring-blue-500${quantity.length > 0 ? " bg-blue-300 bg-opacity-20" : "bg-white"} `}
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
                  <FontAwesomeIcon icon={faMinus} className="text-xl text-white" />
                </div>
                <div className="bg-teal-600 hover:bg-teal-800 active:bg-teal-700 rounded-full h-10 w-10 flex items-center justify-center transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95" onClick={qualitycounterplus}>
                  <FontAwesomeIcon icon={faPlus} className="text-xl text-white" />
                </div>
              </div>

            </div>
          </div>


        </div>

        <div className=" mt-4 col-span-10 bg-white shadow-lg rounded-lg p-10 flex inset-0 space-x-4 items-center  " style={{ height: "100px" }}>
          <div className="text-xl font-medium">Payment Method :</div>
          <select className="text-xl bg-supabaseGray-light text-white  w-1/6 text-center h-10 rounded-lg" value={paymentType}
            onChange={(e) => {
              setPaymentType(e.target.value)
            }}>
            <option>Cash</option>
            <option>Online</option>
          </select>
        </div>
        <div className=" mt-4 col-span-10 bg-white shadow-lg rounded-lg p-10 flex flex-col inset-0  space-y-2 justify-center items-start" style={{ height: "150px" }}>
          <div className="text-xl font-medium"> GST:</div>
          <div className="w-full space-x-4">

            {isCustomGst ? (
              <input
                type="number"
                value={gstRate}
                onChange={(e) => setGstRate(parseFloat(e.target.value))}
                className="border  text-xl rounded-lg w-1/3 p-3"
                placeholder="Enter custom GST % "
              />
            ) : (
              <select
                value={gstRate}
                onChange={(e) => setGstRate(parseFloat(e.target.value))}
                className="border p-3 text-xl rounded-lg bg-supabaseGray-light text-white w-1/3"
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

        <div className=" mt-4 col-span-10 bg-white shadow-lg rounded-lg p-10 flex  flex-col inset-0  justify-start items-start  space-y-2 " style={{ height: "250px" }}>
          <div className="text-xl font-medium">Description</div>
          <textarea
            className={`text-xl w-full rounded-lg border-gray-200  border p-3.5 mr-5 focus:border-blue-500 focus:outline-none focus:ring-blue-500 h-52 ${description.length > 0 ? " bg-blue-300 bg-opacity-20" : "bg-white"} `}
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
        <div className="col-span-10 rounded-lg pt-6 flex items-center justify-end">


          <button
            onClick={() => { setConfirmationbox(true) }}
            className="bg-blue-500 hover:bg-blue-600 text-white text-xl py-2 rounded-lg shadow-lg  transition duration-300  w-1/4"
          >
            Add Purchase
          </button>
        </div>
      </div>





      {showProductList && (

        <div className="fixed inset-0 bg-black bg-opacity-30 z-50">
          <div className="hidden lg:block  h-full bg-white  shadow-md  w-1/4 transition delay-300 ease-in-out overflow-y-auto fixed right-0 top-15 z-50 pb-1 animate-slideIn">
            {/* This side section can display accounts or other relevant information */}
            <div className="text-2xl m-4 top-0 right-0 fixed hover:bg-gray-200 hover : bg-opacity-5 hover:text-red-500 cursor-pointer mr-5 mt-3 w-10 h-10 flex items-center justify-center  " onClick={() =>
              setShowProductList(false)

            } ><FontAwesomeIcon icon={faMultiply} />
            </div>

            {rawmaterial.map((item) => (
              <div className="bg-white shadow-md overflow-hidden" key={item._id}>
                <div className="bg-gradient-to-tr from-teal-800 to-teal-600 text-gray-200 text-xl font-medium p-4">
                  {item.catogory}
                </div>
                <div className="divide-y divide-gray-200">
                  {item.submaterial.length > 0 ? (
                    item.submaterial.map((sub) => (
                      <div
                        className="p-4 hover:bg-blue-100 cursor-pointer"
                        key={sub._id}
                        onClick={() => {
                          selectSubMaterial(sub, item)
                        }
                        }

                      >
                        <span className="text-blue-800 font-medium">{sub.name}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-gray-500">No submaterials available.</div>
                  )}
                </div>
              </div>
            ))}
            {/* Display product list or other data here */}
          </div>
        </div>
      )}

      {showDealerList && (
        <div className="bg-black fixed inset-0 bg-opacity-30 z-50">
          <div className="hidden lg:block h-full bg-white shadow-md  w-1/4 transition delay-300 ease-in-out overflow-y-auto fixed right-0 top-15 z-50 pb-16 animate-slideIn">
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
                  <div className="bg-gradient-to-tr  text-black text-xl  p-4 hover:bg-blue-300 hover:bg-opacity-30 " key={vendor._id} onClick={(

                  ) => {
                    setVendor(vendor)
                    setShowDealerList(false)
                  }}>
                    {vendor.name}
                  </div>
                ))}
              </div>
            ) : (<div className="text-supabaseGray-light text-xl text-center mt-6">Please Add a Vendor To continue</div>)}
          </div>
        </div>
      )}
    </div>
  </div>
  );
};



export default PurchaseForm;