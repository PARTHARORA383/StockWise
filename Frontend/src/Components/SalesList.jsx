import axios from "axios"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faIndianRupeeSign, faPlus, faSearch , faMultiply, faRupee, faRupeeSign  , faPen , faTrash} from "@fortawesome/free-solid-svg-icons"
import { faUser, faBuilding  } from '@fortawesome/free-regular-svg-icons';

const SalesList = () => {
  const [sales, setSales] = useState([])
  const [selectedsale , setSelectedSale] = useState()
  const [rendersale , setRenderSale] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { companyid , uid } = useParams()
  const [search, setSearch] = useState("");
  const [ isClosing  , setIsClosing] = useState(false)
  const navigate = useNavigate()


  const FetchSales = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/Sales/${uid}/${companyid}`)
      setSales(response.data);
    } catch (e) {
      alert("Error Fetching Sales")
    }
  }
 

  useEffect(() => {
 FetchSales()
  }, [])


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sale?")) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_BASE_URL}/Sales/${uid}/${companyid}/${id}`);
        if (response.status === 200) {
          // Remove the deleted sale from state
          setSales(sales.filter(sale => sale._id !== id));
          setRenderSale(false);
          alert("Sale deleted successfully");
          FetchSales()
          
        }
      } catch (error) {
        alert("Error deleting sale");
      }
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_BASE_URL}/Sales/${uid}/${companyid}/${id}`, {
        Product: selectedsale.Product,
        quantity: selectedsale.quantity,
        rate: selectedsale.rate,
        description: selectedsale.description,
        gstRate: selectedsale.gstRate
      });

      if (response.status === 200) {
        // Update the sales list with updated sale
        setSales(sales.map(sale => 
          sale._id === id ? {...sale, ...selectedsale} : sale
        ));
        setRenderSale(false);
        setIsEditing(false);
        alert("Sale updated successfully");
        FetchSales()
      }
    } catch (error) {
      alert("Error updating sale");
    }
  };

  const handleEdit = (id) => {
    setIsEditing(true);
    // Find the sale to edit
    const saleToEdit = sales.find(sale => sale._id === id);
    if (saleToEdit) {
      setSelectedSale(saleToEdit);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedSale(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleonSearch = (e) => {
    setSearch(e.target.value)
  }

  const navigatetoform = () => {
    navigate(`/SalesForm/${uid}/${companyid}`)
  }

  const filteredsale = sales.filter((sale) => {
    return (
      sale.billNumber.toLowerCase().includes(search.toLowerCase()) ||
      sale.dealer.toLowerCase().includes(search.toLowerCase()) ||
      sale.Productname.toLowerCase().includes(search.toLowerCase()) 
    )
  })
    
  const totalamount = filteredsale.reduce((acc, sale) => acc + sale.rate * sale.quantity, 0);

  const total_amount_postGst = filteredsale.reduce((acc, sale) => acc + sale.total_amount_postGst, 0);

  const handleanimating = (closeFunction)=>{
    setIsClosing(true)
    setTimeout(()=>{
      closeFunction(false)
      setIsClosing(false)
      setIsEditing(false);
    },600)
  }


  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Header */}
      <div className=" sticky z-20 border-b-2 top-0 bg-white h-16 text-supabaseGray-dark text-2xl flex items-center justify-center lg:justify-start ">
        <div className="w-1/4  ml-5"> Sales </div>
       
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div className="bg-gradient-to-br from-teal-600 to-teal-800 hover:bg-gradient-to-bl transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 rounded-lg shadow-md p-6">
          <p className="text-sm text-white">Gross Sales Value</p>
          <p className="text-2xl font-bold text-gray-100 mt-2">
            <FontAwesomeIcon icon={faIndianRupeeSign} className="text-xl" /> {totalamount.toLocaleString()}
          </p>
        </div>

        <div className="bg-gradient-to-br from-teal-600 to-teal-800 hover:bg-gradient-to-bl transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 rounded-lg shadow-md p-6">
          <p className="text-sm text-white">Total Sales Value (Inc. GST)</p>
          <p className="text-2xl font-bold text-gray-100 mt-2">
            <FontAwesomeIcon icon={faIndianRupeeSign} className="text-xl" /> {total_amount_postGst.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search and Add */}
      <div className="p-4 space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              onChange={handleonSearch}
              value={search}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by bill number, dealer or product..."
            />
          </div>
          <button
            onClick={navigatetoform}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Add Sale</span>
          </button>
        </div>
      </div>

      {/* Sales List */}
      <div className="p-4 bg-gray-100">
        <div className="flex flex-col gap-4 rounded-lg shadow-md bg-gray-100 ">
          {filteredsale.map((sale, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedSale(sale)
                setRenderSale(true)
              }}
              className=" shadow-md rounded-lg bg-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between mb-2 ml-4 mt-2 ">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faBuilding} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 ">{sale.dealer}</h3>
                    <p className="text-sm text-gray-500 ">{sale.Productname}</p>
                  </div>
                </div>
                <div className="text-right mr-4 mt-0.5">
                  <p className="font-medium text-gray-900">₹{sale.total_amount_postGst.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{new Date(sale.date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex gap-4 text-sm text-gray-600 ml-4">
                <span>Qty: {sale.quantity}</span>
                <span>Rate: ₹{sale.rate}</span>
                <span>Bill No: {sale.billNumber}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sale Details Modal */}
      {rendersale && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${isClosing ? "animate-fadeOut" : "animate-fadeIn"}`}>
          <div className={`fixed bottom-0 inset-x-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto ${isClosing ? "animate-slideOutDown" : "animate-slideInUp"}`}>
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Sale Details</h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleEdit(selectedsale._id)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>
                <button
                  onClick={() => handleDelete(selectedsale._id)} 
                  className="text-red-600 hover:text-red-700"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button 
                  onClick={() => handleanimating(setRenderSale)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  <FontAwesomeIcon icon={faMultiply} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{new Date(selectedsale.date).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Invoice No.</p>
                  <p className="font-medium">{selectedsale.billNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Vendor</p>
                  <p className="font-medium">{selectedsale.dealer}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">{selectedsale.paymentType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Rate</p>
                  {isEditing ? (
                    <input
                      type="number"
                      name="rate"
                      value={selectedsale.rate}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  ) : (
                    <p className="font-medium">₹{selectedsale.rate}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Product</p>
                  {isEditing ? (
                    <input
                      type="number"
                      name="rate"
                      value={selectedsale.Productname}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  ) : (
                    <p className="font-medium">{selectedsale.Productname}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Quantity</p>
                  {isEditing ? (
                    <input
                      type="number"
                      name="quantity" 
                      value={selectedsale.quantity}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  ) : (
                    <p className="font-medium">{selectedsale.quantity}</p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-gray-600 mb-2 font-medium">Description</h3>
                {isEditing ? (
                  <textarea
                    name="description"
                    value={selectedsale.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows="3"
                  />
                ) : (
                  <p className="text-gray-700">{selectedsale.description}</p>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Sub Total (excl. GST)</span>
                  <span>₹{selectedsale.total_amount}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>GST ({selectedsale.gstRate}%)</span>
                  <span>₹{selectedsale.total_amount_postGst - selectedsale.total_amount}</span>
                </div>

                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t">
                  <span>Total Amount</span>
                  <span>₹{selectedsale.total_amount_postGst}</span>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdate(selectedsale._id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SalesList  