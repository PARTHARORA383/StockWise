import axios from "axios"
import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBuilding, faBuildingFlag, faIndianRupeeSign, faMoneyBill, faMoneyBillAlt, faMoneyBillTrendUp, faMoneyBillWave, faMultiply, faPerson, faPlus } from "@fortawesome/free-solid-svg-icons"
import { use } from "react"
import CustomDatePicker from "../Components/DatePicker"
import { useCompany } from "../Components/Companycontext"
import { add } from "date-fns"

const Vendors = () => {

  const [Vendorslist, setVendorList] = useState([])
  const [ vendortype , setVendorType] = useState("Purchase")
  const [vendorname , setVendorName] = useState("")
  const [ currentbalance, setCurrentBalance] = useState()
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")
  const [GSTIN, SetGSTIN] = useState("")
  const [Phone_number, SetPhone_number] = useState()

  const [rendervendor, setRenderVendor] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedDealer, setSelectedDealer] = useState()
  const [addDealer, setAddDealer] = useState(false)
  const[showDealer , setShowDealer] = useState(false)
  const [selectvalue , setSelectValue] = useState("")
  const [isClosing , setIsClosing] = useState(false)


  const uid = JSON.parse(localStorage.getItem("uid"))
  const { companyid } = useParams()
  const {selectedDates , setSelectedDates} = useCompany()


  const location = useLocation()
  const navigate = useNavigate()

  const handleFetchvendors = async () => {

    const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/vendor/${uid}/${companyid}`)
    setVendorList(response.data.fetchVendors)

  }


  useEffect(() => {
    handleFetchvendors()
  }, [companyid])


  const resetform = () => { 
    setVendorName("")
    setDescription("")
    SetPhone_number()
    setSelectValue("Purchase")
    setVendorType("Purchase")
  }

  const handlePostvendors = async ()=>{


    const requestbody = {
      name : vendorname ,
      date : selectedDates,
      current_balance : Number(currentbalance),
      dealer_type : vendortype,
      address : address,
      GSTIN : GSTIN,
      Phone_number : Number(Phone_number),
      description : description 
    }

    try{

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/vendor/${uid}/${companyid}` , requestbody , {
      headers : {
        "Content-Type" : "application/json"
      }
    })

    if(response.status === 200){
      setAddDealer(false)
      handleFetchvendors()
      resetform()
      alert("Dealer Created")
      handleGoBack()

    }
  }catch(e){
    alert("Error Creating Dealer")

  }

  }

  
  const handleGoBack = () => {
    if (location.state?.from === `/PurchaseForm/${uid}/${companyid}`) {
      navigate(-1); // Navigate back only if user came from HomePage
    }
  };


  const handleanimating = (closeFunction)=>{

      setIsClosing(true)
      setTimeout(()=>{
        closeFunction(false)
        setIsClosing(false)
      },600)
  }

  const handleonSearch = (e) => {
    setSearch(e.target.value)
  }

  const filteredvendor = Vendorslist.filter((exp) => {
    return (
      exp.name.toLowerCase().includes(search.toLowerCase()) 
    )

  }
  )


  const totalbalance = filteredvendor.reduce((acc, exp) => acc + exp.current_balance, 0);


  useEffect(() => {
    if (selectedDealer) {
      setCurrentBalance(selectedDealer.current_balance || "");
      setVendorName(selectedDealer.name || "")
      setVendorType(selectedDealer.dealer_type|| "")
      setDescription(selectedDealer.description || "nothing")

    }
  }, [selectedDealer]);

  return <div className="ml-10">



    {rendervendor && (

      <div className={`z-10 fixed inset-0  h-screen bg-black bg-opacity-30 transition-transform duration-300 ${isClosing ? "animate-fadeOut" : "animate-fadeIn"}`}>
        <div className={`fixed z-30 top-0 right-0 h-screen bg-white overflow-y-auto  overflow-x-hidden shadow-lg ${isClosing ? "animate-slideOut" : "animate-slideIn"} `}style={{ width: "600px"}}>

          <div className="text-2xl m-4 top-0 right-0 fixed hover:bg-gray-200 hover : bg-opacity-5 hover:text-red-500 cursor-pointer mr-5 mt-3 w-10 h-10 flex items-center justify-center " onClick={() => {
            handleanimating(setRenderVendor)
            setVendorName("")
            setDescription("")
            SetPhone_number()
            setSelectValue("Purchase")
            setVendorType("Purchase")
          }} ><FontAwesomeIcon icon={faMultiply} /></div>
          <div className="text-2xl text-center mt-10">
            Vendor Details
          </div>

          <div className="text-2xl ml-4 mt-4 mb-1s font-bold">{vendorname}</div>
         

      

          <div className="flex justify-between items-center m-4">
            <div className="text-xl "> Vendor GSTIN :</div>
            <div className=" text-xl mr-4  text-gray-700"> {GSTIN}</div>
          </div>
          <div className="flex justify-between items-center m-4">
            <div className="text-xl "> Vendor Contact No. :</div>
            <div className=" text-xl mr-4  text-gray-700"> {Phone_number}</div>
          </div>
          <div className="flex justify-between items-center m-4">
            <div className="text-xl "> Vendor Type :</div>
            <div className=" text-xl mr-4  text-gray-700"> {vendortype}</div>
          </div>
          <div className="flex justify-between items-center m-4">
            <div className="text-xl "> Registered On :</div>
            <div className=" text-xl mr-4  text-gray-700"> {new Date(selectedDealer.date).toLocaleDateString('en-CA')}</div>
          </div>

          <div className="m-4">
            <div className="text-xl "> Description : </div>
            <div className=" text-xl mr-4   break-words text-justify text-gray-700 "> {description}</div>
          </div>
          <div className="flex justify-between items-center m-4 mt-5 border-t-2 border-gray-700">
            <div className="text-xl mt-2">Balance</div>
            <div className=" text-xl mr-4 mt-2  text-gray-700"> {currentbalance}</div>
          </div>




        </div>
      </div>
    )}

    {/* {showDealer && (
     <div className={`absolute inset-0 flex items-center justify-center  w-full h-screen z-30 bg-black bg-opacity-30 transition-transform duration-300 `}>
      <div className="relative  bg-gradient-to-bl from-teal-600 to-teal-800 text-white w-1/4 rounded-xl">
      <div className="text-2xl m-4 top-0 right-0 absolute hover:bg-teal-200 hover : bg-opacity-5 rounded-full cursor-pointer mr-5 mt-3 w-10 h-10 flex items-center justify-center " onClick={() => {
        setShowExpenseItem(false)
          }} ><FontAwesomeIcon icon={faMultiply} /></div>
        <div className="text-2xl m-4">Expense Items</div>
        <div>{ExpenseType.map((exp)=>(
          <div className="text-2xl hover:bg-teal-700  m-2 rounded-lg p-3 cursor-pointer" onClick={()=>{
            setExpenseName(exp.name)
            setShowExpenseItem(false)
          }}> {exp.name}</div>
        ))}</div>
      </div>
      </div>
    )} */}


    {addDealer && (
       <div className={`z-10 fixed inset-0  h-screen bg-black bg-opacity-30 transition-transform duration-300 ${isClosing ? "animate-fadeOut" : "animate-fadeIn"}`}>
     <div
      className={`bg-white h-screen fixed top-0 right-0 ${isClosing ? 'animate-slideOut' : 'animate-slideIn'}`}
      style={{ width: "600px" }}
     >

          <div className="text-2xl m-4 top-0 right-0 fixed hover:bg-gray-200 hover : bg-opacity-5 hover:text-red-500 cursor-pointer mr-5 mt-3 w-10 h-10 flex items-center justify-center  " onClick={() => {
            handleanimating(setAddDealer)
            setVendorName("")
            setDescription("")
            SetPhone_number()
            setSelectValue("")
            setVendorType("")
          }} ><FontAwesomeIcon icon={faMultiply} />
          </div>
          <div className="flex items-center justify-between">

          <div className="text-xl m-3">Create a Vendor</div>
          <div className="flex  justify-start flex-col items-end mt-4  mr-16 mb-4">
            <div className="mr-4 " style={{width : "200px" }}><CustomDatePicker/></div>
            </div>
          </div>

          <div className=" w-full border-2 "></div>

          { 
            //Date Picker
          }
       


          {
            //Dealer Name 
          }

          <div className="flex flex-col border-2 h-25 m-4 rounded-xl p-4"> 
          <div className="flex flex-col">
          <div className="text-xl font-normal"> Vendor Name </div>
          <input className=" mt-4 h-11 p-2 border-gray-200 border-2 rounded-lg text-xl  focus:outline-blue-500 " placeholder="Add Vendor Name"
          value={vendorname}
           onChange={(e)=>{
            setVendorName(e.target.value)
          }}/>
       
          </div>
          <div className="flex flex-col mt-4">
          <div className="text-xl font-normal"> GSTIN</div>
          <input className=" mt-4 h-11 p-2 border-gray-200 border-2 rounded-lg text-xl  focus:outline-blue-500 " placeholder="Enter Vendor GSTIN"
          value={GSTIN}
           onChange={(e)=>{
            SetGSTIN(e.target.value)
          }}/>
          </div>
          <div className="flex flex-col mt-4">
          <div className="text-xl font-normal"> Contact Number</div>
          <input className=" mt-4 h-11 p-2 border-gray-200 border-2 rounded-lg text-xl  focus:outline-blue-500 " placeholder="Enter Vendor contact no."
          value={Phone_number}
           onChange={(e)=>{
            SetPhone_number(e.target.value)
          }}/>
          </div>
          </div>

          <div className="flex items-center justify-between m-4 mt-6 p-2 ">   
             
            <div className=" text-xl font-normal"> Vendor Type </div>
            <select className="w-1/3 text-xl h-10 text-black border-2 cursor-pointer space-y-2  rounded-md p-1" value={selectvalue}
            onChange={(e)=>{
              setSelectValue(e.target.value)
              console.log("this is the selectvalue", e.target.value)
              setVendorType(e.target.value)
              console.log("this is the vendortype", vendortype)
              
            }}>
            <option>Purchase</option>
            <option>Sale</option>
            <option>Other</option>
              
            </select>
          </div>

            <div className=" flex flex-col pt-4 pb-8  p-2 border-2 m-4 rounded-lg">
            <div className="text-xl font-normal ">  Balance </div>
            <input className=" w-full mt-4 h-11 p-2 border-gray-200 border-2 rounded-lg text-xl  focus:outline-blue-500 " placeholder={`Enter Amount `} 
            onChange={(e)=>{
              setCurrentBalance(e.target.value)
            }}/>
            </div>
            <div className="m-4">
            <div className="text-xl font-normal ">  Description </div>
            <textarea className="w-full mt-4 h-32 p-2 border-gray-200 border-2 rounded-lg text-xl  focus:outline-blue-500  resize-none" placeholder={`Enter Text Here... `} 
            value={description}
            onChange={(e)=>{
              setDescription(e.target.value)
            }}/>
            </div>

            <div className="bg-blue-500 rounded-lg text-white h-11 flex items-center justify-center m-4 ml-8 mr-8 text-lg hover:bg-blue-600 hover:cursor-pointer " onClick={handlePostvendors}>  
            Save
          </div>
            
        </div>
      </div>
    )}

    <div className="text-3xl ">Vendors</div>
    <div className="grid grid-cols-12 bg-gray-100 p-14 border-t-2 border-b-2 ">


      <div className={`flex flex-col justify-start text-3xl col-span-3  bg-gradient-to-l from-teal-600 to-teal-800 rounded-xl  text-white px-4 py-2.5 hover:scale-105 transition-transform duration-200`}>
        <div className="text-xl font-light  text-white p-3">
          <h2>Total Balance Value</h2>
        </div>
        <div className="font-normal text-3xl pl-5">
          <h2> <FontAwesomeIcon icon={faIndianRupeeSign} />{"  " + totalbalance}</h2>
        </div>
      </div>
      <div className=" col-span-8">

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

        <div className="text-lg mr-10  " onClick={() => {
          setAddDealer(true)
        }}>
          <button type="button" className="py-3.5 px-5 me-2 mb-2 text-md font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10   dark:focus:ring-gray-700 dark:bg-teal-800 dark:text-white  dark:hover:text-white dark:hover:bg-gray-700 " ><FontAwesomeIcon icon={faPlus} className="text-lg" /> Add Vendor</button>
        </div>

      </div>
    </div>




    <div className=" flex justify-center bg-gray-100 rounded-lg shadow-lg  p-4 mb-6 mr-8 ml-4 text-gray-950 ">
      <div className="flex-1 mx-2">
        <h2 className="text-xl font-semibold">Name</h2>
      </div>
  
      <div className="flex-1 mx-2">
        <h2 className="text-xl font-semibold">Vendor Type</h2>
      </div>

      <div className="flex-1 mx-2">
        <h2 className="text-xl font-semibold">Balance</h2>
      </div>
    </div>

    {filteredvendor.map((exp, index) => (
      <div
        key={index}
        className=" mr-8 ml-4 flex items-center justify-between bg-white hover:bg-blue-300 hover:bg-opacity-30 rounded-lg shadow-lg p-4 mb-6  text-gray-800"
        onClick={() => {
          setSelectedDealer(exp)
          setRenderVendor(true)
        }} >
      
        <div className="flex-1 mx-2">
          <h2 className="text-lg font-semibold">
            <p><FontAwesomeIcon icon={faBuildingFlag} />{" " + exp.name}</p>
          </h2>
        </div>

        
        <div className="flex-1 mx-2">
          <h2 className="text-lg font-semibold">

            <p>{"  " + exp.dealer_type}</p>
          </h2>
        </div>

        <div className="flex-1 mx-2">
          <h2 className="text-lg font-semibold">
            <p><FontAwesomeIcon icon={faIndianRupeeSign} />{"  " + exp.current_balance}</p>

          </h2>
        </div>


      </div>
    ))}
  </div>
}


export default Vendors;