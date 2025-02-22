import { useEffect , useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useCompany } from '../Components/Companycontext'




const GetProduct = ()=>{

  const [products , setProducts] = useState([])

  const {selectedProduct , setSelectedProduct} = useCompany()
  const {selectedProductid , setSelectedProductid} = useCompany()


  const {companyid} = useParams()



  const FetchProduct = async ()=>{
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/ManufacturedProducts/${companyid}`)
    setProducts(response.data)
    console.log(response.data)

  }
  useEffect(()=>{
      FetchProduct()
  },[])


  return <div className='w-full'>

      <div className='bg-gradient-to-r from-teal-800 to-teal-600 h-10 text-xl text-white p-2 '> List of all Products </div>
    <div className=' flex flex-col'>
      {products.map((product)=>(
        <div className='text-lg w-full p-3.5 hover:bg-blue-300 hover:bg-opacity-20 border-b-2 border-opacity-40
        or-pointer transition-all duration-200 ease-in-out text-blue-800' key = {product._id} onClick={()=>{

          selectProduct(product._id , product.Productname)
        }}>
       {product.Productname}

        </div>
      ))}
    </div>


  
  
    </div>
  



}


export default GetProduct