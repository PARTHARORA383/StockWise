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
  const {selectedsubrawmaterial , setSelectedsubrawmaterial ,
    showProductList, setShowProductLis
  } = useCompany()


  const modalRef = useRef(null)
  const handleonkeydown = (e , nextRef)=>{
    if(e.key == 'Enter'){
      e.preventDefault()
      nextRef.current.focus()
    }

   }

   


   const selectSubMaterial = (submaterial, rawmaterial) => {
    setSelectedsubrawmaterial(submaterial);
    setSelectedrawmaterial(rawmaterial);
    setShowProductList(false)
  };

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
        `${import.meta.env.VITE_BACKEND_BASE_URL}/ManufacturedProducts/${companyid}`,
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
    <div className="grid grid-cols-12 h-full">  

      <div className="col-span-12 lg:col-span-8 h-full flex justify-center items-center">

        {confirmationbox && (
          <div className="fixed z-50 inset-0 h-screen w-full flex justify-center items-center bg-black bg-opacity-50 transition duration-300 ease-in-out" 
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
            <div className="text-center bg-white p-4 sm:p-5 rounded-lg shadow-lg w-11/12 sm:w-96 mx-4">
              <h2 className="text-lg sm:text-xl mb-4">Are you sure you want to add this product?</h2>
              <button
                className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded mr-2 hover:opacity-90"
                onClick={handleconfirm}>
                Yes
              </button>
              <button
                className="bg-blue-500 hover:opacity-90 text-white px-3 sm:px-4 py-2 rounded"
                onClick={handlecancel}>
                No
              </button>
            </div>
          </div>
        )}

        {/* Pop out form */}
        <div className="p-4 sm:p-6 space-y-4 bg-gray-100 h-auto sm:h-4/5 w-full sm:m-10 shadow-lg rounded-xl">
          <div className="text-lg sm:text-xl text-center mb-6 sm:mb-10">Register The Products You Sell</div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center">
            <label className="text-base sm:text-lg font-medium mb-2 sm:mb-0 sm:m-2 w-full sm:w-1/3">Product Name:</label>
            <input
              type="text"
              value={productname}
              onChange={(e) => setProductname(e.target.value)}
              className={`p-2 rounded-lg sm:m-2 w-full sm:w-2/3 text-base sm:text-lg border-2 ${productname.length > 0 ? "bg-blue-300 bg-opacity-20" : "bg-gray-100"} focus:outline-none`}
              placeholder="Type Your Product Name"
              required
            />
          </div>
          
          <div className="space-y-4">
            <div className="text-base sm:text-lg font-medium mb-2 sm:m-2">Product Composition</div>
            {composition.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm sm:text-md">
                <input
                  type="text"
                  value={item.submaterialname || ""}
                  onFocus={() => handleFieldFocus(index)}
                  className={`focus:outline-none p-2 rounded-lg w-full sm:w-1/4 border-2 ${item.submaterialname.length > 0 ? "bg-blue-300 bg-opacity-20" : 'bg-gray-100'}`}
                  placeholder="Select a Rawmaterial"
                  required
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                  className={`focus:outline-none p-2 rounded-lg w-full sm:w-1/4 border-2 ${item.quantity.length > 0 ? "bg-gray-300 bg-opacity-20" : 'bg-gray-100'}`}
                  placeholder="Quantity"
                  required
                />
                <input
                  type="text"
                  value={item.unit || ""}
                  onChange={(e) => handleInputChange(index, "unit", e.target.value)}
                  className={`focus:outline-none p-2 rounded-lg w-full sm:w-1/4 border-2 ${item.unit.length > 0 ? "bg-gray-300 bg-opacity-20" : 'bg-gray-100'}`}
                  placeholder="Unit (e.g., meter)"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeCompositionField(index)}
                  className="text-red-500 hover:underline text-sm sm:text-md w-full sm:w-auto text-center sm:text-left"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addCompositionField}
            className="mt-2 text-blue-500 hover:underline text-sm sm:text-base"
          >
            + Add More Composition
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto bg-teal-700 text-white px-4 sm:px-6 py-2 rounded-lg mt-4 sm:m-5"
            onClick={()=>{setConfirmationbox(true)}}
          >
            Create Product
          </button>
        </div> 
      </div>
    

              
      {showProductList && (

<div className="fixed inset-0 bg-black bg-opacity-30 z-30">
  <div className=" lg:block  h-full bg-white  shadow-md  lg:w-1/4 transition delay-300 ease-in-out overflow-y-auto fixed right-0 top-15 z-50 pb-1 animate-slideIn">
    {/* This side section can display accounts or other relevant information */}
    <div className="text-2xl m-4 top-0 right-0 fixed hover:bg-gray-200 hover : bg-opacity-5 hover:text-red-500 cursor-pointer mr-5 mt-3 w-10 h-10 flex items-center justify-center  " onClick={() =>
      setShowProductList(false)

    } ><FontAwesomeIcon icon={faMultiply} />


    </div>
    <div className="ml-10 mb-4 mt-14 h-12 bg-blue-500 hover:bg-blue-700  rounded-xl flex items-center justify-center text-lg text-white cursor-pointer" style={{ width: "400px" }} onClick={()=>{
      setShowAddRawmaterial(true)
    }}>
      <FontAwesomeIcon icon={faPlus} className="mr-2"/>
      Create a New Rawmaterial
    </div>

    {rawmaterial.length > 0 ? (
      <div>
        {rawmaterial.map((item) => (
          <div className="bg-white shadow-md overflow-hidden" key={item._id}>
            <div className="bg-gradient-to-tr from-teal-800 to-teal-600 text-gray-200 lg:text-lg text-md font-medium p-4">
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
                <div className="p-4 text-gray-500"> No submaterials available. </div>
              )}
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


    </div>
  );
};

export default ProductForm;
