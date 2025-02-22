import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBuilding, faIndianRupeeSign, faMoneyBill, faMoneyBillAlt, faMoneyBillTrendUp, faMoneyBillWave, faMultiply, faPlus } from "@fortawesome/free-solid-svg-icons"
import { use } from "react"
import CustomDatePicker from "../Components/DatePicker"
import { useCompany } from "../Components/Companycontext"
const Expenses = () => {

  const [Expenselist, setExpenseList] = useState([])
  const [ExpenseType , setExpenseType] = useState([])
  const [expenseCategory, setExpenseCategory] = useState("")
  const [expensename , setExpenseName] = useState("")
  const [expenseAmount, setExpenseAmount] = useState()
  const [expenseDate, setExpenseDate] = useState(new Date())
  const [paymentType, setPaymentType] = useState("Cash")
  const [description, setDescription] = useState("")
  const [renderExpense, setRenderExpense] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedExpense, setSelectedExpense] = useState()
  const [addExpense, setAddExpense] = useState(false)
  const[showExpenseItem , setShowExpenseItem] = useState(false)
  const [selectvalue , setSelectValue] = useState("Cash")
  const [isClosing , setIsClosing] = useState(false)


  const uid = JSON.parse(localStorage.getItem("uid"))
  const { companyid } = useParams()
  const {selectedDates , setSelectedDates} = useCompany()

  const handlefetchexpense = async () => {

    const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/Expense/${uid}/${companyid}`)
    setExpenseList(response.data.fetchExpenses)
    setExpenseType(response.data.fetchCategories)


  }


  useEffect(() => {
    handlefetchexpense()
  }, [companyid])

  const handlePostExpenst = async ()=>{


    const requestbody = {
      date : selectedDates || expenseDate,
      expensename : expensename ,
      expenseAmount : expenseAmount,
      paymentType : paymentType,
      description : description 
    }

    try{

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/Expense/${uid}/${companyid}` , requestbody , {
      headers : {
        "Content-Type" : "application/json"
      }
    })

    if(response.status === 200){
      setAddExpense(false)
      handlefetchexpense()
      alert("expense Created")

    }
  }catch(e){
    alert("Error Creating Expense")

  }

  }

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

  const filteredExpense = Expenselist.filter((exp) => {
    return (
      exp.expensename.toLowerCase().includes(search.toLowerCase()) ||
      exp.paymentType.toLowerCase().includes(search.toLowerCase())
    )

  }
  )


  const totalamount = filteredExpense.reduce((acc, exp) => acc + exp.expenseAmount, 0);


  useEffect(() => {
    if (selectedExpense) {
      setExpenseDate(selectedExpense.date || null)
      setExpenseAmount(selectedExpense.expenseAmount || "");
      setExpenseName(selectedExpense.expensename || "")
      setPaymentType(selectedExpense.paymentType || "")
      setDescription(selectedExpense.description || "nothing")

    }
  }, [selectedExpense]);

  return <div>
    

    <div className=" sticky z-20 border-b-2 top-0 bg-white h-16 text-supabaseGray-dark text-2xl flex items-center justify-center lg:justify-start ">
        <div className="w-1/4  ml-5"> Expenses </div>
       
      </div>



    {renderExpense && (

      <div className={`z-50 fixed inset-0  h-screen bg-black bg-opacity-30 transition-transform duration-300 ${isClosing ? "animate-fadeOut" : "animate-fadeIn"}`}>
        <div className={`fixed z-30 top-0 right-0 h-screen bg-white overflow-y-auto  overflow-x-hidden shadow-lg ${isClosing ? "animate-slideOut" : "animate-slideIn"} `}style={{ width: "500px"}}>

          <div className="text-2xl m-4 top-0 right-0 fixed hover:bg-gray-200 hover : bg-opacity-5 hover:text-red-500 cursor-pointer mr-5 mt-3 w-10 h-10 flex items-center justify-center " onClick={() => {
            handleanimating(setRenderExpense)
          }} ><FontAwesomeIcon icon={faMultiply} /></div>
          <div className="text-xl text-center mt-10">
            Expense
          </div>

          <div className="text-xl ml-4 mt-4 mb-1s font-bold">{expensename}</div>
         

          <div className="flex justify-between items-center m-4">
            <div className="text-lg "> Expense Date :</div>
            <div className="text-lg ml-4 text-gray-700 ">{new Date(expenseDate).toLocaleDateString('en-CA')}</div>
          </div>

          <div className="flex justify-between items-center m-4">
            <div className="text-lg "> Payment Method :</div>
            <div className=" text-lg mr-4  text-gray-700"> {paymentType}</div>
          </div>

          <div className="m-4">
            <div className="text-lg "> Description : </div>
            <div className=" text-lg mr-4   break-words text-justify text-gray-700 "> {description}</div>
          </div>
          <div className="flex justify-between items-center m-4 mt-5 border-t-2 border-gray-700">
            <div className="text-lg mt-2"> Gross Total</div>
            <div className=" text-lg mr-4 mt-2  text-gray-700"> {expenseAmount}</div>
          </div>




        </div>
      </div>
    )}

    {showExpenseItem && (
     <div className={`absolute inset-0 flex items-center justify-center  w-full h-screen z-50 bg-black bg-opacity-30 transition-transform duration-300 `}>
      <div className="relative  bg-gradient-to-bl from-teal-600 to-teal-800 text-white w-1/4 rounded-xl">
      <div className="text-lg m-4 top-0 right-0 absolute hover:bg-teal-200 hover : bg-opacity-5 rounded-full cursor-pointer mr-5 mt-3 w-10 h-10 flex items-center justify-center " onClick={() => {
        setShowExpenseItem(false)
          }} ><FontAwesomeIcon icon={faMultiply} /></div>
        <div className="text-lg m-4">Expense Items</div>
        <div>{ExpenseType.map((exp)=>(
          <div className="text-lg hover:bg-teal-700  m-2 rounded-lg p-3 cursor-pointer" onClick={()=>{
            setExpenseName(exp.name)
            setShowExpenseItem(false)
          }}> {exp.name}</div>
        ))}</div>
      </div>
      </div>
    )}

    {addExpense && (
       <div className={`z-50 fixed inset-0  max-h-screen bg-black bg-opacity-30 transition-transform duration-300 ${isClosing ? "animate-fadeOut" : "animate-fadeIn"}`}>
     <div
      className={`bg-white h-screen fixed top-0 right-0 ${isClosing ? 'animate-slideOut' : 'animate-slideIn'}`}
      style={{ width: "450px" }}
     >

          <div className="text-lg m-4 top-0 right-0 fixed hover:bg-gray-200 hover : bg-opacity-5 hover:text-red-500 cursor-pointer mr-5 mt-3 w-8 h-8 flex items-center justify-center  " onClick={() => {
            handleanimating(setAddExpense)
            setExpenseName("")
            setDescription("")
            
          }} ><FontAwesomeIcon icon={faMultiply} />
          </div>
          <div className="text-lg m-3">Create An Expense</div>

          <div className=" w-full border-2 "></div>

          { 
            //Date Picker
          }
          <div className="flex w-full justify-start flex-col items-end mt-4 space-y-2">
            <div className="text-sm mr-24 text-gray-700"> Expense Date</div>
            <div className="mr-4 " style={{width : "180px" }}><CustomDatePicker/></div>
            </div>


          {
            //Expense Category 
          }

          <div className="flex flex-col border-2 h-46 m-4 rounded-xl p-3"> 
          <div className="flex flex-col">
          <div className=" text-sm lg:text-base font-normal"> Expense Item </div>
          <input className=" mt-4 h-9 p-2 border-gray-200 border-2 rounded-lg text-sm lg:text-base focus:outline-blue-500 " placeholder="Add Expense Name"
          value={expensename}
           onChange={(e)=>{
            setExpenseName(e.target.value)
          }}/>
          <div className="bg-blue-500 rounded-lg text-white h-9 flex items-center justify-center m-4 text-sm hover:bg-blue-600 hover:cursor-pointer" onClick={()=>{
            setShowExpenseItem(true)
          }}>  
          <div>
           <FontAwesomeIcon icon={faPlus}/> Select an Expense Item</div>
          </div>
          </div>
          </div>

          <div className="flex items-center justify-between m-4 mt-6 p-2 ">   
             
            <div className=" text-base font-normal"> Payment Method </div>
            <select className="w-1/3 text-base h-9 text-black border-2 cursor-pointer space-y-2  rounded-md p-1" value={selectvalue}
            onChange={(e)=>{
              setSelectValue(e.target.value)
              setPaymentType(selectvalue)
              
            }}>
            <option>Cash</option>
            <option>Online</option>
              
            </select>
          </div>

            <div className=" flex flex-col pt-4 pb-8  p-2 border-2 m-4 rounded-lg">
            <div className="text-base font-normal ">  Amount </div>
            <input className=" w-full mt-4 h-9 p-2 border-gray-200 border-2 rounded-lg text-base focus:outline-blue-500 " placeholder={`Enter Amount `} 
            onChange={(e)=>{
              setExpenseAmount(e.target.value)
            }}/>
            </div>
            <div className="m-4">
            <div className="text-base font-normal ">  Description </div>
            <textarea className="w-full mt-4 h-12 p-2 border-gray-200 border-2 rounded-lg text-base focus:outline-blue-500  resize-none" placeholder={`Enter Text Here... `} 
            value={description}
            onChange={(e)=>{
              setDescription(e.target.value)
            }}/>
            </div>

            <div className="bg-blue-500 rounded-lg text-white h-9 flex items-center justify-center m-4 ml-8 mr-8 text-base hover:bg-blue-600 hover:cursor-pointer " onClick={handlePostExpenst}>  
            Save
          </div>
            
        </div>
      </div>
    )}

 
    <div className="grid grid-cols-12 bg-gray-100 p-8 ">


      <div className={`flex flex-col justify-start text-3xl col-span-9 lg:col-span-3  bg-gradient-to-br from-teal-600 to-teal-800  hover:bg-gradient-to-r hover:from-teal-800 hover:to-teal-600 rounded-xl  text-white px-4 py-2.5 hover:scale-105 transition-transform duration-400`}>
        <div className="text-xl font-light  text-white p-3">
          <h2>Total Expense Value</h2>
        </div>
        <div className="font-normal text-3xl pl-5">
          <h2> <FontAwesomeIcon icon={faIndianRupeeSign} />{"  " + totalamount}</h2>
        </div>
      </div>
      <div className=" col-span-8">

      </div>
    </div>



    <div className=" grid grid-cols-12">
      <form className="w-full p-5  lg:ml-2 col-span-12 lg:col-span-6 ">
        <label for="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w- h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input type="search" onChange={handleonSearch} value={search} id="default-search" className="block w-full p-2.5 ps-10 text-md lg:text-lg text-black font-medium border border-gray-300 rounded-full bg-gray-100 focus:ring-blue-500 " placeholder="Search " required />

        </div>
      </form>
      <div className="col-span-12 lg:col-span-6 flex justify-center lg:justify-end items-center m-6 ">

        <div className="text-md lg:text-lg mr-10  " onClick={() => {
          setAddExpense(true)
        }}>
          <button type="button" className=" py-2.5 px-5 me-2 mb-2 text-md font-medium text-gray-900 focus:outline-none rounded-full border border-gray-200 hover:bg-teal-800 hover:text-white bg-teal-600 text-white" ><FontAwesomeIcon icon={faPlus} className="text-lg" /> Add Expense</button>
        </div>

      </div>
    </div>




    <div className=" flex justify-center bg-gray-100 rounded-lg shadow-lg  p-2 mb-6  ml-2 mr-2 lg:mr-8 lg:ml-4  text-gray-950 ">
      <div className="flex-1 mx-2">
        <h2 className="text-lg font-medium">Date</h2>
      </div>
      <div className="flex-1 mx-2">
        <h2 className="text-lg font-medium">Expense</h2>

      </div>

      <div className="flex-1 mx-2">
        <h2 className="text-lg font-medium">Amount</h2>
      </div>
      <div className="flex-1 mx-2">
        <h2 className="text-lg font-medium">Payment</h2>
      </div>
    </div>
    {filteredExpense.map((exp, index) => (
      <div
        key={index}
        className="mr-2 ml-2 md:mr-8  md:ml-4 flex flex-row md:flex-row md:items-center justify-between bg-white hover:bg-blue-300 hover:bg-opacity-30 rounded-lg shadow-lg p-2 md:p-2 mb-4 md:mb-6 text-gray-800 cursor-pointer"
        onClick={() => {
          setSelectedExpense(exp)
          setRenderExpense(true)
        }} >
        <div className="flex-1 mx-1 md:mx-2 mb-2 md:mb-0">
          <h2 className="text-base md:text-lg font-medium">
            <p>{new Date(exp.date).toLocaleDateString('en-CA')}</p>
          </h2>
        </div>
        <div className="flex-1 mx-1 md:mx-2 mb-2 md:mb-0">
          <h2 className="text-base md:text-lg font-medium">
            <p><FontAwesomeIcon icon={faMoneyBillTrendUp} className="mr-1" />{exp.expensename}</p>
          </h2>
        </div>

        <div className="flex-1 mx-1 md:mx-2 mb-2 md:mb-0">
          <h2 className="text-base md:text-lg font-medium">
            <p><FontAwesomeIcon icon={faIndianRupeeSign} className="mr-1" />{exp.expenseAmount}</p>
          </h2>
        </div>

        <div className="flex-1 mx-1 md:mx-2">
          <h2 className="text-base md:text-lg font-medium">
            <p>{exp.paymentType}</p>
          </h2>
        </div>
      </div>
    ))}
  </div>
}


export default Expenses