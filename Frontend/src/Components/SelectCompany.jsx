import axios from "axios"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useCompany } from "./Companycontext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import { faCheck, faCross, faDeleteLeft, faEdit, faMultiply, faPenSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";
import UseRegister from "../Hooks/UseRegister";


const SelectCompany = () => {
  const [companies, setCompanies] = useState([]);
  const [renderbutton, setrenderbutton] = useState(false);

  const navigate = useNavigate()

  const { companyid } = useParams();
  const { rendercompany, setRendercompany, selectedCompany, setSelectedCompany  , Registercompany, setRegistercompany} = useCompany();
  const [Rendercompanyinfo, setRendercompanyinfo] = useState(false)

  const [companyinfo, setCompanyinfo] = useState()

  const [checkcompany, setCheckcompany] = useState()
  const [companyname , setcompanyname]  = useState('')


  const [editmode, setEditmode] = useState(false)
  const [companyalertbox, setcompanyalertbox] = useState(false)
  const [DeleteBox, setDeleteBox] = useState(false)
  const [Deletecompanyname, setDeletecompanyname] = useState('')

  const uid = JSON.parse(localStorage.getItem("uid"))

  const getCompany = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/${uid}`);
      if (response.status === 200) {
        setCompanies(response.data);
      }
    } catch (e) {
      alert("Error Fetching Companies");
    }
  };

  const handleDeleteCompany = async () => {

    try {

      if (!companyinfo || !companyinfo.name || !Deletecompanyname) {
        alert("Invalid company information or name entered.");
        return;
      }
      
      
      console.log( "Company name is selected " + companyinfo.name.toUpperCase() )
      
      if (companyinfo.name.toUpperCase() === Deletecompanyname.toUpperCase()) {

        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_BASE_URL}/company/${companyinfo._id}`)

        if (response.status === 200) {
          alert('Company Deleted')
          setDeleteBox(false)
          setRendercompanyinfo(true)
          setRendercompany(false) 
          window.location.reload()
         
        }
        else {
          console.log("Teri maa ka bhosda")
        }
      }
    } catch (e) {
      alert('Cannot Delete Company')
      setDeleteBox(false)
    }
  }

  const getselectedcompany = async (companyid) => {
    try {

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/company/${companyid}`)

      if (response.status === 200) {

        setCompanyinfo(response.data)
        setRendercompanyinfo(true)

        console.log(response.data)
     
      }

    } catch (e) {
      alert("Error logging company")
    }

  }

  useEffect(() => {
    getCompany();
  }, [companyid]);


  const Showcompanyinfo = (company) => {
    setCheckcompany(company)
    getselectedcompany(company._id)


  }

  const Select_company = async () => {
    await setSelectedCompany(checkcompany)

    setcompanyalertbox(false)
    setRendercompanyinfo(false)
    setRendercompany(false)
    navigate(`/Dashboard/${checkcompany}`)
    window.location.reload()
  }

  const Delete_company =  () => {

     handleDeleteCompany()
  

  }

  const handleconfirm1 = () => {

    Select_company()

  }

  const handlecancel1 = () => {
    setcompanyalertbox(false)
  }
  return (
    <div className="absolute z-20 inset-0 w-full h-screen bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300 ease-out">
      <div
        className={`relative w-1/3 bg-white rounded-lg shadow-md transform scale-95 transition-transform duration-300 ease-in-out animate-popIn  ${rendercompany ? "" : "animate-popOut"}`}

      >
        {/* Close Button */}
        <div
          className="absolute text-3xl top-0 right-0 m-2 hover:text-gray-600 transition-colors duration-300 ease-in-out cursor-pointer  "
          onClick={() => setRendercompany(false)}
        >
          <FontAwesomeIcon icon={faMultiply} />
        </div>

        {/* Title */}
        <div className="flex items-center justify-between mt-5">
          <div className="text-2xl m-4 mt-6">Registered Companies</div>

          {/* Create Button */}
          <div
            className="text-lg m-4 mt-8 mr-12 relative"
            onMouseEnter={() => setrenderbutton(true)} // Trigger on hover
            onMouseLeave={() => setrenderbutton(false)}
            onClick={()=>{
              setRegistercompany(true)
            }} // Reset on hover out
          >
            <button
              type="button"
              className="py-2 px-7 me-2 mb-2 text-md font-medium text-gray-900 bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:outline-none transition-all duration-300 ease-in-out dark:bg-teal-700 dark:text-gray-200 dark:border-teal-900 dark:hover:text-white dark:hover:bg-gray-700 dark:hover:border-gray-900"
            >
              <FontAwesomeIcon icon={faPlus} className="text-lg" /> Create
            </button>
            {renderbutton && (
              <div
                className="bg-gray-100 rounded-lg absolute z-30 p-4 text-center transform -translate-x-1/2 animate-fadeIn text-lg opacity-0 transition-opacity duration-300 ease-in-out"
                style={{ width: "250px", left: "50%", opacity: renderbutton ? 1 : 0 }}
              >
                Create more companies
              </div>
            )}
          </div>
        </div>

        {/* Company List */}
        {companies.map((company) => (
          <div
            key={company.id}
            className="text-xl m-3 p-3 hover:bg-blue-300 hover:bg-opacity-30 rounded-lg transition-all duration-300 ease-in-out cursor-pointer" onClick={() => {
              Showcompanyinfo(company)
            }}
          >
            {company.name}
          </div>
        ))}
      </div>

      {Rendercompanyinfo && (
        createPortal(
          <div className=" z-20 fixed top-0 right-0 bg-gray-50 h-screen" style={{ width: "550px" }}>


            <div className="text-2xl font-sans ml-5 mt-5 mb-3 font-bold flex justify-between items-center">
              {editmode ? (
                <div>Update Details</div>
              ) : (
                <div>Company Details</div>
              )}
              <div> {editmode ? (
                <div className="mr-10 hover:text-gray-700  " onClick={() => { setEditmode(false) }}><FontAwesomeIcon icon={faMultiply} /></div>
              ) : (
                <div className="mr-10 hover:text-gray-700  " onClick={() => { setRendercompanyinfo(false) }}><FontAwesomeIcon icon={faMultiply} /></div>)}</div>
            </div>
            <div className="ml-5 text-xl ">
              {editmode ? (
                <div>Update your Company Details</div>
              ) : (
                <div>Check your Company Details</div>
              )}
            </div>

            <div className="m-2 text-xl flex flex-col mt-4">
              <span className="font-semibold ml-3">Company Name: </span>
              {editmode ? (
                <input
                  className="p-3 h-11 mr-6 mt-1 ml-3 border-2 rounded-lg "
                  value={companyinfo.name}
                  onChange={(e) => {

                  }} />
              ) : (<div className="ml-3 p-1 text-gray-500 font-medium ">
                {companyinfo.name|| "Loading"}</div>
              )}
            </div>
            <div className="m-2 text-xl flex flex-col mt-4">
              <span className="font-semibold ml-3">Owner: </span>
              {editmode ? (
                <input
                  className="p-3 h-11 mr-6 mt-1 ml-3 border-2 rounded-lg "
                  value={companyinfo.owner}
                  onChange={(e) => {

                  }} />
              ) : (<div className="ml-3 p-1 text-gray-500  font-medium">
                {companyinfo.owner}</div>
              )}            </div>
            <div className="m-2 text-xl mt-4">
              <span className="font-semibold m-3">Address: </span>

              <div className="flex  items-center m-1">
                <span className="font-semibold w-1/3 ml-3"> Country : </span>
                {editmode ? (
                  <input
                    className="p-3 h-11 mr-6 mt-1 ml-3 border-2 rounded-lg w-2/3 "
                    value={companyinfo.address.country}
                    onChange={(e) => {

                    }} />
                ) : (<div className="ml-3 p-1 text-gray-500 font-medium ">
                  {companyinfo.address.country}</div>
                )}


              </div>


              <div className="flex items-center m-1">
                <span className="font-semibold m-1 w-1/3 ml-3"> State : </span>
                {editmode ? (
                  <input
                    className="p-3 h-11 mr-6 mt-1 ml-3 border-2 rounded-lg w-2/3 "
                    value={companyinfo.address.state}
                    onChange={(e) => {

                    }} />
                ) : (<div className="ml-3 p-1 text-gray-500 font-medium ">
                  {companyinfo.address.state}</div>
                )}
              </div>

              <div className="flex items-center m-1">
                <span className="font-semibold m-1 w-1/3 ml-3"> Local : </span>
                {editmode ? (
                  <input
                    className="p-3 h-11 mr-6 mt-1 ml-3 border-2 rounded-lg w-2/3 "
                    value={companyinfo.address.local}
                    onChange={(e) => {

                    }} />
                ) : (<div className="ml-3 p-1 text-gray-500 font-medium ">
                  {companyinfo.address.local}</div>
                )}
              </div>

            </div>
            <div className="m-2 text-xl flex flex-col ">
              <span className="font-semibold m-3">Start Date: </span>
              {editmode ? (
                <input
                  className="p-3 h-11 mr-6  ml-3 border-2 rounded-lg  "
                  value={new Date(companyinfo.startdate).toLocaleDateString()}

                  onChange={(e) => {

                  }} />

              ) : (<div className="ml-3 p-1 text-gray-500  font-medium">
                {new Date(companyinfo.startdate).toLocaleDateString()}
              </div>
              )}

            </div>


            <div className="m-2 text-xl flex flex-col">
              <span className="font-semibold m-3">Renew Date: </span>
              {editmode ? (
                <input
                  className="p-3 h-11 mr-6  ml-3 border-2 rounded-lg  "
                  value={new Date(companyinfo.enddate).toLocaleDateString()}

                  onChange={(e) => {

                  }} />

              ) : (<div className="ml-3 p-1 text-gray-500 font-medium ">
                {new Date(companyinfo.enddate).toLocaleDateString()}
              </div>
              )}

            </div>

            {editmode ? (
              <div className="flex justify-center mt-8">
                <button
                  type="button"
                  className="py-3 px-10 me-2 mb-2 text-xl font-medium text-gray-900 bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:outline-none transition-all duration-300 ease-in-out dark:bg-teal-700 dark:text-gray-200 dark:border-teal-900 dark:hover:text-white dark:hover:bg-gray-700 dark:hover:border-gray-900"
                >
                  <FontAwesomeIcon icon={faPenSquare} className="text-lg" /> Update
                </button>
              </div>
            ) : (

              <div className="flex  m-6 ">
                <div className="w-1/3 m-3" onClick={() => {
                  setcompanyalertbox(true)
                }}> <button
                  type="button"
                  className="py-3.5 px-7 me-2 mb-2 text-xl font-medium text-gray-900 bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:outline-none transition-all duration-300 ease-in-out dark:bg-custom-lavender dark:text-gray-100 dark:border-purple-300 dark:hover:text-white dark:hover:bg-gray-700 dark:hover:border-gray-900  w-full"
                >
                    <FontAwesomeIcon icon={faCheck} className="text-lg" /> Select
                  </button></div>

                <div className="w-1/3 m-3" onClick={() => {
                  setEditmode(true)
                }}> <button
                  type="button"
                  className="py-3 px-7 me-2 mb-2 text-xl font-medium text-gray-900 bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:outline-none transition-all duration-300 ease-in-out dark:bg-teal-700 dark:text-gray-200 dark:border-teal-900 dark:hover:text-white dark:hover:bg-gray-700 dark:hover:border-gray-900 w-full"
                >
                    <FontAwesomeIcon icon={faEdit} className="text-lg" /> Edit
                  </button></div>

                <div className="w-1/3 m-3" onClick={ () => {
                  setDeleteBox(true)
                }}> <button
                  type="button"
                  className="py-3 px-9 text-xl font-medium text-gray-900 bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:outline-none transition-all duration-300 ease-in-out dark:bg-red-700 dark:text-gray-200 dark:border-red-900 dark:hover:text-white dark:hover:bg-gray-700 dark:hover:border-gray-900 w-full"
                >
                    Delete
                  </button></div>
              </div>
            )}



          </div>,
          document.body
        )
      )}


      {DeleteBox && (
        <div className="fixed inset-0 z-50 h-screen flex justify-center items-center bg-black bg-opacity-70">
          <div className=" text-center bg-white p-5 rounded-lg shadow-lg w-1/3">
            <div className="mb-5">
              <input type="text" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-200 block w-full p-3" placeholder="Company Name" required onChange={(e) => { setDeletecompanyname(e.target.value) }} />
            </div>
            <h2 className="text-xl mb-4">Are you sure you want to delete this company?</h2>
            <div className="text-red-500 text-sm m-4"> Note : All the Data linked to this company will be deleted</div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:opacity-90"
              onClick={Delete_company}
            >
              Yes
            </button>
            <button
              className="bg-blue-500 hover:opacity-90 text-white px-4 py-2 rounded mr-2"
              onClick={() => {
                setDeleteBox(false)
              }}
            >
              No
            </button>



          </div>
        </div>
      )}


      {companyalertbox && (
        <div className="fixed inset-0 z-50 h-screen flex justify-center items-center bg-black bg-opacity-70  ">
          <div className=" text-center bg-white p-5 rounded-lg shadow-lg w-96">
            <h2 className="text-xl mb-4">Are you sure you want to select this company?</h2>
            <button
              className="bg-blue-500 text-white px-5 py-2 rounded-md mr-2 hover:opacity-90"
              onClick={handleconfirm1}
            >
              Yes
            </button>
            <button
              className="bg-blue-500 hover:opacity-90 text-white px-5 py-2 rounded-md mr-2"
              onClick={handlecancel1}
            >
              No
            </button>


          </div>
        </div>
      )}

      {Registercompany && (
        <UseRegister/>
      )}
    </div>
  );
};

export default SelectCompany;

