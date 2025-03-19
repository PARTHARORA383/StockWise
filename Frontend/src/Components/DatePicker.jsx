import React, { useState , useEffect , useRef  } from "react";
import axios from "axios";
import { format } from "date-fns"; // For date formatting
import { useCompany } from "./Companycontext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar , faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

const CustomDatePicker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const ref = useRef()
  const {selectedDates , setSelectedDates} = useCompany()
  const [showDatePicker , setShowDatePicker] = useState(false)

  const months = Array.from({ length: 12 }, (_, index) =>
    new Date(0, index).toLocaleString("default", { month: "long" })
  );

  const years = Array.from(
    { length: 100 },
    (_, index) => new Date().getFullYear() - index
  );

  const [selectedMonth, setSelectedMonth] = useState(selectedDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(selectedDate.getFullYear());

  const handleDateChange = (day) => {
    const newDate = new Date(selectedYear, selectedMonth, day);
    setSelectedDate(newDate)
    setSelectedDates(newDate);
    console.log(newDate)
    setShowDatePicker(false)
  };

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();


  // useEffect(()=>{

  //   const handleClickoutsideref = (event)=>{

  //     if(ref.current &&  !ref.current.contains(event.target)){
  //       setShowDatePicker(false)
  //     }
  //   }


  //   document.addEventListener("mousedown" , handleClickoutsideref)


  //   return ()=> {
  //     document.removeEventListener("click" , handleClickoutsideref)}
  // } , [])

  return (<div className="relative " ref={ref}>

        <div className="flex justify-center items-center lg:space-x-1 border border-gray-400  py-1.5 rounded-xl ">
        <input
          type="text"
          readOnly
          value={format(selectedDate, "dd/MM/yyyy")}
          className="rounded text-md lg:text-md focus:outline-none  flex justify-end items-center " style={{width:"120px"}}

          onClick={()=>{
            setShowDatePicker(true)
          }}
          />
          <FontAwesomeIcon icon={faCalendarAlt} className=" text-md lg:text-lg hover : cursor-pointer hover:text-blue-800 text-blue-600" onClick={()=>{
            setShowDatePicker(true)
          }}/>
        {/* <button
          className="bg-blue-600 text-white px-9 py-2 rounded hover:bg-blue-700"
          onClick={(e)=>{
            const formatedDate = format(selectedDate , "yyyy-MM-dd")
            setSelectedDates(formatedDate)
            setShowDatePicker(false)
          }}
          >
          Select
        </button> */}
      </div>


    {showDatePicker &&  (

<div className="absolute z-20 p-5 mx-auto bg-white rounded-2xl shadow-md right-0 " style={{width : "350px" , height : "350px"}} >
{/* Month & Year Select */}
<div className="flex justify-between mt-4  space-x-4">
  <select
    value={selectedMonth}
    onChange={(e) => setSelectedMonth(Number(e.target.value))}
    className="border px-2 py-2 rounded w-1/2"
    >
    {months.map((month, index) => (
      <option key={month} value={index}>
        {month}
      </option>
    ))}
  </select>

  <select
    value={selectedYear}
    onChange={(e) => setSelectedYear(Number(e.target.value))}
    className="border px-2 py-2 rounded w-1/2"
    >
    {years.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ))}
  </select>
</div>

{/* Days */}
<div className="grid grid-cols-7 gap-3 mt-4">
  {Array.from({ length: daysInMonth }, (_, index) => (
    <button
    key={index}
    onClick={() => handleDateChange(index + 1)}
    className={`p-2 rounded ${
      index + 1 === selectedDate.getDate()
      ? "bg-blue-500 text-white"
      : "bg-gray-100"
    } hover:bg-gray-200`}
    >
      {index + 1}
    </button>
  ))}
</div>
</div>




    )}



</div>


  );
};

export default CustomDatePicker;
