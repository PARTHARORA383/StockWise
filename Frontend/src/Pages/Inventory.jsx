import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Inventory = () => {


  const [rawmaterial, setRawmaterial] = useState([])
  const [Product, setProduct] = useState([])
  const { companyid } = useParams();
  const [renderRawmaterial, setRenderRawmaterial] = useState(true)
  const [renderProduct, setRenderProduct] = useState(false)



  const fetch = async () => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/rawmaterial/${companyid}`)
    setRawmaterial(response.data);

  }
  useEffect(() => {
    fetch();
  }, [])


  const FetchProduct = async () => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/ManufacturedProducts/${companyid}`)
    setProduct(response.data)
    console.log(Product)
  }



  return <div className=" h-full ml-10 mr-5" >
    <div className="h-14 text-2xl font-semibold border-b-2">
      Stocks
    </div>

    <div className=" font-sans text-5xl m-5 text-black ">
      Inventory
      <div className="text-xl mt-2 font-poppins text-black" >
        A Clear View of Your Stock for Better Decision Making
      </div>
    </div>

    <div className=" flex justify-start mt-10  border-b-2 border-amber-950 ">
      <div className={` text-black relative text-2xl border-r-2 border-amber-950 p-1 pl-6 pr-9 cursor-pointer  after:absolute after:left-0 after:bottom-0 after:h-0.5 
      after:w-0 after:bg-orange-200 after:transition-all 
      hover:after:w-full hover:after:shadow-[0px_0px_8px_2px_rgba(255,140,0,0.8)] ${renderRawmaterial ? " text-amber-700 text-opacity-50  " : ""} `} onClick={() => {
          setRenderProduct(false);
          setRenderRawmaterial(true)
        }}>
        Rawmaterial
      </div>
      <div className={` text-amber-950 relative text-2xl  border-amber-950 p-1 pl-6 pr-9 cursor-pointer  after:absolute after:left-0 after:bottom-0 after:h-0.5 
      after:w-0 after:bg-orange-200 after:transition-all 
      hover:after:w-full hover:after:shadow-[0px_0px_8px_2px_rgba(255,140,0.8)] ${renderProduct ? " text-amber-700  text-opacity-50 " : ""} `} onClick={() => {
          setRenderProduct(true);
          setRenderRawmaterial(false)
          FetchProduct(
          )
        }}>
        Products
      </div>
    </div>


    {
      // Render Products 
    }



    {renderProduct && (<div className="  grid grid-cols-5 m-5">

      {Product.map((product) => (

        <div className="flex p-5 ">
          <div className="  h-24  w-72  shadow-lg bg-white hover:bg-teal-700 hover:bg-opacity-30 rounded-lg flex  flex-col items-center justify-center">
            <div className="text-xl  font-medium ">
              {product.Productname}
            </div>
            <div>{

              "Quantity - " +  product.quantity}
            </div>
            </div>
        </div>

      ))}

    </div>)}



    {
      //Render Rawmaterials 
    }
    {renderRawmaterial && (<div>


      {rawmaterial.map((rawmaterial) => (
        <div className="pb-10"> {//main div for one category and all it subcategories 
        }
          <div className=" h-12 bg-gray-100 bg-opacity-70 shadow-lg text-2xl p-2 pl-4 mt-1 text-teal-700 font-sans">{rawmaterial.catogory}</div>

          <div className="grid grid-cols-5 m-5  ">
            {rawmaterial.submaterial.map((submaterial) => (
              <div className=" flex h-24 w-72 shadow-xl justify-center items-center rounded-xl m-4 hover:bg-teal-700 hover:bg-opacity-40 bg-white ">
                <div className="flex flex-col ">
                  <div className="text-xl text-amber-950 font-poppins font-semibold p-1">{submaterial.name[0].toUpperCase() + submaterial.name.slice(1)}
                  </div>
                  <div className="flex text-lg text-amber-950 ">
                    <div className="p-1">
                      Total Stock :
                    </div>
                    <div className="p-1">
                      {submaterial.quantity || "0"}
                    </div>
                    <div className="p-1">
                      {submaterial.unit}
                    </div>
                  </div>
                </div>
              </div>

            ))}
          </div>


        </div>


      ))}
    </div>
    )}
  </div>
}


export default Inventory;