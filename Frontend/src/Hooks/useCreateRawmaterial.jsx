import { useState, useEffect } from "react";
import axios from "axios";

const useCreateRawmaterial = (uid, companyid) => {
  const [rawmaterial, setRawmaterial] = useState([]);
  const [submaterials, setSubmaterials] = useState([])
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([])
  const [rawmaterialid, setRawmaterialid] = useState("")
  const [submaterial, setSubmaterial] = useState("")
  const [forceupdate , setForceupdate] = useState(0)

  const fetchRawMaterials = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/rawmaterial/${uid}/${companyid}`);
      setRawmaterial(response.data);

      const uniqueCategories = [...new Set(response.data.map((item) => item.catogory))];
      setCategories(uniqueCategories);


    } catch (error) {
      console.error("Error fetching raw materials:", error);
    }
  };

  const addRawMaterial = async (category, item, quantity = 0) => {
    const existingCategory = rawmaterial.find((mat) => mat.catogory.toLowerCase() === category.toLowerCase());
  
    try {
      if (existingCategory) {
        let existingsubmaterial = null;
  
        try {
          existingsubmaterial = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/rawmaterial/${uid}/${companyid}/${category}/${item}`);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.log("Submaterial not found, adding new submaterial.");
          } else {
            console.error("Error fetching submaterial:", error);
            return;
          }
        }
  
        if (existingsubmaterial && existingsubmaterial.status === 200) {
          await axios.put(
            `http://${VITE_APP_BACKEND_BASE_URL}/rawmaterial/${uid}/${companyid}/${existingsubmaterial.data.rawmaterialId}/${existingsubmaterial.data.submaterialId}`,
            { updatedquantity: Number(quantity) }
          );
          alert("Product successfully added");
          fetchRawMaterials();
          setForceupdate((prev)=>prev + 1)

        } else {
          const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_BASE_URL}/${uid}/${companyid}/${existingCategory._id}`,
            { subrawmaterial: [{ name: item.toLowerCase() }] }
          );
          if (response.status === 200) {
            alert("Product successfully added");
            fetchRawMaterials();
            setForceupdate((prev)=>prev + 1)

          }
        }
      } else {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/rawmaterial/${uid}/${companyid}`, {
          catogory: category.toLowerCase(),
          subrawmaterial: [{ name: item.toLowerCase() }],
        });
        if (response.status === 201) {
          alert("Product successfully added");
           fetchRawMaterials();
           setForceupdate((prev)=>prev + 1)
          FetchParticularRawmaterial(category, item);
        }
      }
    } catch (e) {
      alert("Error adding raw material. Try again.");
    }
  };
  
  const FetchParticularRawmaterial = async (category, item) => {

    const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/rawmaterial/${uid}/${companyid}/${category}/${item}`)

    if (response.status === 200) {
      setRawmaterialid(response.data.id)
      setSubmaterial(response.data.submaterial)
    }

  }

  useEffect(() => {
    fetchRawMaterials();
  }, [companyid , forceupdate]);

  return { rawmaterial, categories, fetchRawMaterials, addRawMaterial, rawmaterialid, submaterial, FetchParticularRawmaterial };
};

export default useCreateRawmaterial;
