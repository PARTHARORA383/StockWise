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

  const addRawMaterial = async (category) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/rawmaterial/${uid}/${companyid}`, {
        catogory: category.toLowerCase(),
      });

      if (response.status === 201) {
        alert("Raw material added successfully");
        fetchRawMaterials();
        setForceupdate((prev)=>prev + 1)
      }
    }catch (error) {
      alert("Error adding raw material. Try again.");
    }
  } 

  
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
