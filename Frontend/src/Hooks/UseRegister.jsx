import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import DatePicker from "react-datepicker";
import { faCheck, faClose, faTimes, faPlus, faMultiply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

import { useState, useEffect } from "react"
import { useCompany } from "../Components/Companycontext";
const UseRegister = (prop) => {


  const {SelectedCompany ,Registercompany, setRegistercompany } = useCompany()
  const [country, setCountry] = useState("")
  const [region, setRegion] = useState("")
  const [registerdate, setRegisterDate] = useState(null)
  const [renewdate, setRenewDate] = useState(null)
  const [companyid, setCompanyid] = useState("")
  const [companyname, setCompanyname] = useState("")
  const [companyOwner, setCompanyOwner] = useState("")
  const [companylocal, setCompanylocal] = useState("")

  const [confirmationbox, setConfirmationbox] = useState(false)
  const [thankyoubox, setThankyoubox] = useState(false)
  const [Alertbox, setAlertbox] = useState(false)


  const handlesubmit = async () => {


    const alphanumericRegex = /^[a-zA-Z0-9]+$/;

    // Check if companyid contains only letters and numbers
    if (!alphanumericRegex.test(companyid)) {
      alert('Company ID should only contain letters and numbers, no special characters.');
      return; // Stop submission if validation fails
    }

    const requestbody = {
      id: companyid,
      name: companyname,
      owner: companyOwner,
      address: {
        country: country,
        state: region,
        local: companylocal,
      },
      startdate: registerdate ? registerdate.toISOString().split('T')[0] : null,
      enddate: renewdate ? renewdate.toISOString().split('T')[0] : null,
    }

    console.log(requestbody)
    try {
      const response = await axios.post(`${process.env.BACKEND_BASE_URL}/company`, requestbody, {

        headers: {
          'Content-Type': 'application/json'
        }
      }
      );
      if (response.status === 201) {

        setThankyoubox(true)
        setSelectedCompany(companyid)
        setTimeout(() => {
          setThankyoubox(false)
          setRegistercompany(false)
          window.location.reload()
        }, 1500)

      }

      if (response.status === 409) {



        setTimeout(() => {

        },
          1500)
      }

      console.log('Response:', response.data);

    } catch (error) {
      console.error('Error during submission:', error);
    }
  };


  const handleconfirm = () => {
    handlesubmit();
    setConfirmationbox(false)
  }

  const handlecancel = () => {
    setRegistercompany(false)
    setConfirmationbox(false)
  }


  return (
    <>
      <div className="w-full rounded-lg transition duration-300 ease-in-out mb-10 " >
        {/* Form Heading */}
        <div className="text-2xl text-center mb-3">
          <h2>Register Your Company</h2>
        </div> 
         
        <div
          className="absolute text-3xl top-0 right-0 m-2 hover:text-gray-600 transition-colors duration-300 ease-in-out cursor-pointer  "
          onClick={() => setRegistercompany(false)}
        >
          <FontAwesomeIcon icon={faMultiply} />
        </div>

        {/* Form Fields */}
        <div className="mb-3 p-3 border-b-2 border-gray-300" >
          <label htmlFor="companyid" className="block mb-2 text-lg font-medium text-gray-900">
            GSTIN
          </label>
          <input
            type="text"
            id="companyid"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-200 block w-full p-3"
            placeholder="Enter your Company GSTIN"
            required
            onChange={(e) => setCompanyid(e.target.value)}
          />
        </div>

        <div className="mb-5 p-3 border-b-2">
          <label htmlFor="companyname" className="block mb-2 text-lg font-medium text-gray-900">
            Company Name
          </label>
          <input
            type="text"
            id="companyname"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-200 block w-full p-3"
            placeholder="Enter the name of your Firm"
            required
            onChange={(e) => setCompanyname(e.target.value)}
          />
        </div>

        <div className="mb-5 p-3 border-b-2 border-gray-300">
          <label htmlFor="companyOwner" className="block mb-2 text-lg font-medium text-gray-900">
            Company Owner
          </label>
          <input
            type="text"
            id="companyOwner"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-200 block w-full p-3"
            placeholder="Firm Owner"
            required
            onChange={(e) => setCompanyOwner(e.target.value)}
          />
        </div>

        {/* Address Section */}
        <div className="mb-5 p-3 border-b-2 border-gray-300">
          <div className="font-medium text-lg mb-3"><h1>Address</h1></div>
          <div className="p-1 rounded-lg">
            <div className="flex items-center justify-between space-x-4">
              <div className="w-1/2">
                <h2>Country</h2>
                <CountryDropdown
                  value={country}
                  onChange={(val) => setCountry(val)}
                  defaultOptionLabel="Select a country"
                  className="h-10 rounded-lg mt-4 w-full border"
                />
              </div>
              <div className="w-1/2">
                <h2>State</h2>
                <RegionDropdown
                  country={country}
                  value={region}
                  onChange={(val) => setRegion(val)}
                  blankOptionLabel="Select a state"
                  defaultOptionLabel="Select a state"
                  className="h-10 rounded-lg mt-4 w-full border"
                />
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="localaddress" className="block mb-2 text-md font-medium text-gray-900">
                Local address
              </label>
              <input
                type="text"
                id="localaddress"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-200 block w-full p-3"
                placeholder="Enter the local address"
                required
                onChange={(e) => setCompanylocal(e.target.value)}
              />
            </div>
          </div>
        </div>

       

        {/* Submit Button */}
        <div className="w-full flex justify-center">
          <button
            type="button"
            className="  text-xl px-12 bg-teal-700 hover:bg-teal-600 text-white py-4 rounded-lg w-1/3"
            onClick={() => {
              setConfirmationbox(true)
            }}
          >
            Submit
          </button>
        </div>

      </div>



      {confirmationbox && (
        <div className="absolute z-50 inset-0 h-screen w-full flex justify-center items-center bg-black bg-opacity-50 transition duration-300 ease-in-out  ">
          <div className=" text-center bg-white p-5 rounded-lg shadow-lg w-96">
            <h2 className="text-xl mb-4">Are you sure?</h2>
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

      {thankyoubox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-10 text-center w-96">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 border-4 border-green-500 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faCheck} className="text-green-500" size="lg" />
              </div>
            </div>
            {/* Thank you message */}
            <h2 className="text-xl font-semibold">Thank you for creating a company</h2>
          </div>
        </div>
      )}

      {Alertbox && (
        <div className="absolute top-0 right-0 left-0 h-screen flex justify-center items-center bg-black bg-opacity-30 ">

          <div className=" rounded-lg w-96 bg-white p-9 shadow-lg transition-all delay-150 ease-in-out  text-center">
            <div class="flex items-center justify-center ">
              <div class="w-12 h-12 border-4 border-green-500 rounded-full flex items-center justify-center transition duration-300 ease-in-out  ">
                <i class="fas fa-check fa-lg"></i>
              </div>
            </div>

            <h2 className=" text-xl pt-5 ">Company Already Exist</h2>
          </div>
        </div>
      )

      }



    </>
  )
}



export default UseRegister;