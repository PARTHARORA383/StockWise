import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WaitLoader from "../Components/waitloader";
const Inventory = () => {


  const [rawmaterial, setRawmaterial] = useState([])
  const [Product, setProduct] = useState([])
  const [loading , setLoading] = useState(false)
  
  const { companyid } = useParams();
  const [renderRawmaterial, setRenderRawmaterial] = useState(true)
  const [renderProduct, setRenderProduct] = useState(false)

const uid = JSON.parse(localStorage.getItem("uid"))

  const fetch = async () => {
    try{
      setLoading(true)
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/rawmaterial/${uid}/${companyid}`)
      setRawmaterial(response.data);
    } catch (error) {
      setLoading(false);
    }
    finally{
      setLoading(false)
    }
  }
  useEffect(() => {
    fetch();
  }, [])


  const FetchProduct = async () => {
    try{
      setLoading(true)
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/ManufacturedProducts/${uid}/${companyid}`)
      setProduct(response.data)
    }catch(error){
      setLoading(false);
    }
    finally{
      setLoading(false)
    }
  }

  if(loading){
    return (
      <div className=" fixed inset-0 flex justify-center items-center h-screen">
        <WaitLoader/>
      </div>
    )
  }
  return (
    <div className="h-full px-6">
      <div className="h-16 border-b border-gray-200 flex items-center">
        <h1 className="text-2xl text-gray-800 font-medium">Inventory Management</h1>
      </div>

      <div className="py-8">
        <h2 className="text-4xl font-medium text-gray-900">Stock Overview</h2>
        <p className="mt-2 text-lg text-gray-600">
          Track and manage your inventory efficiently
        </p>
      </div>

      <div className="flex space-x-6 border-b border-gray-200">
        <button
          className={`pb-4 text-lg font-medium relative ${
            renderRawmaterial 
              ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600" 
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => {
            setRenderProduct(false);
            setRenderRawmaterial(true);
            fetch();
          }}
        >
          Raw Materials
        </button>
        <button
          className={`pb-4 text-lg font-medium relative ${
            renderProduct
              ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => {
            setRenderProduct(true);
            setRenderRawmaterial(false);
            FetchProduct();
          }}
        >
          Products
        </button>
      </div>

      {renderProduct && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {Product.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition duration-200">
              <h3 className="text-lg font-medium text-gray-900">{product.Productname.slice(0,1).toUpperCase() + product.Productname.slice(1)}</h3>
              <p className="mt-2 text-gray-600">Quantity: {product.quantity}</p>
            </div>
          ))}
        </div>
      )}
      {renderRawmaterial && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {rawmaterial.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition duration-200">
              <h3 className="text-lg font-medium text-gray-900">{category.catogory.slice(0,1).toUpperCase() + category.catogory.slice(1)}</h3>
              <p className="mt-2 text-gray-600">Quantity: {category.quantity}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Inventory;