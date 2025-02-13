import React, { useEffect, useState , useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import UseRawmaterial from "../Hooks/UseRawmaterial";
import { useCompany } from "./Companycontext";

const ProductForm = () => {
  const [productname, setProductname] = useState("");
  const [confirmationbox, setConfirmationbox] = useState(false)
  const [composition, setComposition] = useState([{ submaterialid : ""  , submaterialname : "",  quantity: "", unit: "" }]);
  const [activeindex , setActiveindex] = useState(null)

  const{companyid} = useParams()
  const {selectedsubrawmaterial , setSelectedsubrawmaterial} = useCompany()


  const modalRef = useRef(null)
  const handleonkeydown = (e , nextRef)=>{
    if(e.key == 'Enter'){
      e.preventDefault()
      nextRef.current.focus()
    }

   }

   


  const handleFieldFocus = (index) => {
    setActiveindex(index);
  };


const updatedCompositionwithsubmaterial = ()=>{
  if(activeindex !== null && selectedsubrawmaterial){
    const updatedComposition = [...composition]
    updatedComposition[activeindex].submaterialid = selectedsubrawmaterial._id
    updatedComposition[activeindex].submaterialname = selectedsubrawmaterial.name
    console.log(updatedComposition)
    setComposition(updatedComposition)
  }
}



// Handle changes in individual input fields
const handleInputChange = (index, field, value) => {
  const updatedComposition = [...composition];
  updatedComposition[index][field] = value;
  setComposition(updatedComposition);
};


//Calling the updatecompostion function
useEffect(()=>{
  updatedCompositionwithsubmaterial()

},[selectedsubrawmaterial])



  // Add a new empty input field for composition
  const addCompositionField = () => {
    setComposition([...composition, {submaterialid : ""  , submaterialname : "", quantity: "", unit: "" }]);
  };

  // Remove a specific composition field
  const removeCompositionField = (index) => {
    const updatedComposition = composition.filter((_, i) => i !== index);
    setComposition(updatedComposition);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    
    const productData = {
      
      Productname : productname,
      Productcomposition: composition.map((item)=>({

        subrawmaterialId : item.submaterialid,
        name : item.submaterialname,
        quantity : item.quantity,
        unit : item.unit
      }
        
      )),
      company: companyid, // Example: static company ID
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/ManufacturedProducts/${companyid}`,
        productData
      );
      
      console.log("Product created successfully:", response.data);
      if(response.status === 200){
        setConfirmationbox(false)
        window.location.reload()
        alert("Product Listed")
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

   

  const handlecancel = ()=>{
  setConfirmationbox(false)
  }
  const handleconfirm = ()=>{
    handleSubmit()
  }

  return (
    <div className="grid grid-cols-12 h-full ">  


    <div className="col-span-8 h-full flex justify-center items-center">


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
        <h2 className="text-xl mb-4">Are you sure you want to add this product?</h2>
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

   {
    //Pop out form 
   }
    <div className="p-6 space-y-4 bg-gray-100 h-4/5 w-full m-10 shadow-lg rounded-xl">
    <div className="text-xl text-center mb-10 m-2">Register The Products You Sell</div>

      <div className="flex flex-row  items-center">
        <label className="text-lg font-medium m-2 w-1/3">Product Name:</label>
        <input
          type="text"
          value={productname}
          onChange={(e) => setProductname(e.target.value)}
          className={` p-2 rounded-lg m-2 w-2/3 text-lg border-2 ${productname.length > 0  ? "bg-blue-300 bg-opacity-20" : "bg-gray-100 "} focus:outline-none`}          placeholder="Type Your Product Name"
          required
          />
      </div>
      
      <div className="space-y-4">
        <div className="text-lg font-medium m-2">Product Composition</div>
        {composition.map((item, index) => (
          <div key={index} className="flex items-center space-x-4 text-md">
            <input
              type="text"
              value={item.submaterialname || ""}
              onFocus={() => handleFieldFocus(index)}
              className={` focus:outline-none p-2 rounded-lg w-1/4 border-2 ${item.submaterialname.length > 0 ? "bg-blue-300 bg-opacity-20" : 'bg-gray-100'}`}
              placeholder="Select a Rawmaterial"
              required
              
              />
            <input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                handleInputChange(index, "quantity", e.target.value)
              }
              className={` focus:outline-none p-2 rounded-lg w-1/4 border-2 ${item.quantity.length > 0 ? "bg-gray-300 bg-opacity-20" : 'bg-gray-100'}`}
              placeholder="Quantity"
              required
              />
            <input
              type="text"
              value={item.unit || ""}
              onChange={(e) => handleInputChange(index, "unit", e.target.value)}
              className={` focus:outline-none p-2 rounded-lg w-1/4  border-2 ${item.unit.length > 0 ? "bg-gray-300 bg-opacity-20" : 'bg-gray-100'}`}
              placeholder="Unit (e.g., meter)"
              required
              />
            <button
              type="button"
              onClick={() => removeCompositionField(index)}
              className="text-red-500 hover:underline text-md"
              >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addCompositionField}
        className="mt-2 text-blue-500 hover:underline"
        >
        + Add More Composition
      </button>

      <button
        type="submit"
        className="bg-teal-700 text-white px-6 py-2 rounded-lg m-5" 
        onClick={()=>{setConfirmationbox(true)}}
        >
        Create Product
      </button>
    </div> 
          </div>
    
    <div className="col-span-4">
      <UseRawmaterial setActiveindex = {setActiveindex}/>
  </div>


        </div>
  );
};

export default ProductForm;
