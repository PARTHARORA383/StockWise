import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCompany } from "../Components/Companycontext";
import { createPortal } from "react-dom"; // Portal import


const UseRawmaterial = ({setActiveindex}) => {
  const [rawmaterial, setRawmaterial] = useState([]);
  const { companyid } = useParams();
  const { selectedrawmaterial, setSelectedrawmaterial } = useCompany();
  const { selectedsubrawmaterial, setSelectedsubrawmaterial } = useCompany();


  const [showaddRawmaterial, setShowaddRawmaterial] = useState(false)
  const [Catogory, setCategory] = useState("")
  const [item, setItem] = useState("")
  const [categories, setCategories] = useState([]);




  const fetch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/rawmaterial/${companyid}`);
      setRawmaterial(response.data);
      console.log(response.data);


      const uniquecategories = [...new Set(response.data.map(item => item.catogory))]
      setCategories(uniquecategories)
    } catch (error) {
      console.error("Error fetching raw materials:", error);
    }

  };

  useEffect(() => {

    fetch();
  }, [companyid]); // Ensure companyid is included as a dependency

  const selectsubmaterial = (submaterial, rawmaterial) => {
    setSelectedsubrawmaterial(submaterial); // Set selected submaterial name
    setSelectedrawmaterial(rawmaterial); // Set selected rawmaterial category
    

    // Log after state update
    console.log("Submaterial:", submaterial.name);
    console.log("Rawmaterial:", rawmaterial.catogory);

  };

  //CREATING A RAWMATERIAL 
  const handleaddRawmaterial = async () => {
    const existingcategory = rawmaterial.find((item) => item.catogory === Catogory)

    try {
      if (existingcategory) {
        const response = await axios.put(`http://localhost:3000/rawmaterial/${companyid}/${existingcategory._id}`, {
          catogory: Catogory,
          subrawmaterial: [
            {
              name: item
            }
          ]})
        if (response.status == 200) {
          setShowaddRawmaterial(false)
          alert("Product successfully added")
          await fetch()
        }
      }

      if (!existingcategory) {
        const response = await axios.post(`http://localhost:3000/rawmaterial/${companyid}`, {
          catogory: Catogory,
          subrawmaterial: [{
            name: item
          }]
        })

        if (response.status == 201) {
          setShowaddRawmaterial(false)
          alert("Product successfully added")
          await fetch()
        }

      }


    } catch (e) {
      alert("error adding raw material Try again")
      setShowaddRawmaterial(false)
    }

  }



  const renderAddRawmaterialModal = () =>
    createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white w-1/2 p-8 rounded-lg shadow-lg" >
          <h2 className="text-xl mb-6 text-center">Add Raw Material</h2>

          {/* Category Input */}
          <div className="mb-4 flex items-center">
            <label className="text-lg w-1/3">Category:</label>
            <input
              className="text-lg rounded-lg border-gray-300 p-3 w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Select or create a category"
              list="category-list"
              value={Catogory}
              onChange={(e) => setCategory(e.target.value)}
            />
            <datalist id="category-list">
              {categories.map((cat, index) => (
                <option key={index} value={cat} />
              ))}
            </datalist>
          </div>

          {/* Product Input */}
          <div className="mb-4 flex items-center">
            <label className="text-lg w-1/3">Product:</label>
            <input
              className="text-lg rounded-lg border-gray-300 p-3 w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Product Name"
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="text-center mt-6">
            <button
              onClick={handleaddRawmaterial}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      </div>,
      document.body // Render at the root level of the DOM
    );

  return (
    <div className="w-full bg-gray-100 border-l-2 min-h-screen" onKeyDown={(e) => {
      if (e.key == "Escape") {
        setShowaddRawmaterial(false)
      }
    }}>
      {/* Header */}
      <div className="flex justify-between">

        {showaddRawmaterial && renderAddRawmaterialModal()}

        <div className="text-xl p-6 pb-2 font-semibold text-gray-800">
          List of all rawmaterials 
        </div>
        <button
          type="button"
          className="px-5 me-2 mb-2 mt-2 text-md font-medium text-gray-900 focus:outline-none bg-gray-200 rounded-full focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-900 dark:hover:text-white dark:hover:bg-gray-700"
          onClick={() => { setShowaddRawmaterial(true) }}
        >
          Create
        </button>
      </div>
      <div className="h-1 bg-gradient-to-r from-blue-500 to-green-400"></div>

      <div className="text-gray-900 text-lg w-full">
        {rawmaterial.map((item) => (
          <div className="bg-white shadow-md overflow-hidden" key={item._id}>
            {/* Category */}
            <div className="bg-gradient-to-tr from-teal-800 to-teal-600 text-gray-200 text-xl font-medium p-4 ">
              {item.catogory}
            </div>

            {/* Submaterials */}
            <div className="divide-y divide-gray-200">
              {item.submaterial.length > 0 ? (
                item.submaterial.map((submaterialId) => (
                  <div
                    className="p-4 hover:bg-blue-100 cursor-pointer transition-all duration-200 ease-in-out"
                    key={submaterialId._id}
                    onClick={() => selectsubmaterial(submaterialId, item)} // Pass submaterial and item without invoking
                  >
                    <span className="text-blue-800 font-medium">
                      {submaterialId.name}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-gray-500">No submaterials available.</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Export the component
export default UseRawmaterial;
