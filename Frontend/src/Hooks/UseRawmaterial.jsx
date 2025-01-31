import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCompany } from "../Components/Companycontext";
import { createPortal } from "react-dom";
import useCreateRawmaterial from "./useCreateRawmaterial";

const UseRawmaterial = () => {
  const { companyid } = useParams();
  const { selectedrawmaterial, setSelectedrawmaterial } = useCompany();
  const { selectedsubrawmaterial, setSelectedsubrawmaterial } = useCompany();
  const uid = JSON.parse(localStorage.getItem("uid"));

  const { rawmaterial, categories, fetchRawMaterials, addRawMaterial } = useCreateRawmaterial(uid, companyid);

  const [showAddRawmaterial, setShowAddRawmaterial] = useState(false);
  const [category, setCategory] = useState("");
  const [item, setItem] = useState("");

  const selectSubMaterial = (submaterial, rawmaterial) => {
    setSelectedsubrawmaterial(submaterial);
    setSelectedrawmaterial(rawmaterial);
  };

  const renderAddRawmaterialModal = () =>
    createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white w-1/2 p-8 rounded-lg shadow-lg">
          <h2 className="text-xl mb-6 text-center">Add Raw Material</h2>

          <div className="mb-4 flex items-center">
            <label className="text-lg w-1/3">Category:</label>
            <input
              className="text-lg rounded-lg border-gray-300 p-3 w-2/3"
              placeholder="Select or create a category"
              list="category-list"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <datalist id="category-list">
              {categories.map((cat, index) => (
                <option key={index} value={cat} />
              ))}
            </datalist>
          </div>

          <div className="mb-4 flex items-center">
            <label className="text-lg w-1/3">Product:</label>
            <input
              className="text-lg rounded-lg border-gray-300 p-3 w-2/3"
              placeholder="Enter Product Name"
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => {
                addRawMaterial(category, item);
                setShowAddRawmaterial(false);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <div className="w-full bg-gray-100 border-l-2 min-h-screen">
      <div className="flex justify-between">
        {showAddRawmaterial && renderAddRawmaterialModal()}

        <div className="text-xl p-6 pb-2 font-semibold text-gray-800">List of all rawmaterials</div>
        <button
          type="button"
          className="px-5 me-2 mb-2 mt-2 text-md font-medium bg-gray-200 rounded-full"
          onClick={() => setShowAddRawmaterial(true)}
        >
          Create
        </button>
      </div>

      <div className="h-1 bg-gradient-to-r from-blue-500 to-green-400"></div>

      <div className="text-gray-900 text-lg w-full">
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
                    onClick={() => selectSubMaterial(sub, item)}
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
      </div>
    </div>
  );
};

export default UseRawmaterial;
