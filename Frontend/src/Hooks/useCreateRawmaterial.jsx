import { useState, useEffect } from "react";
import axios from "axios";

const useCreateRawmaterial = (uid, companyid) => {
  const [rawmaterial, setRawmaterial] = useState([]);
  const [categories, setCategories] = useState([]);
  const [rawmaterialid , setRawmaterialid] = useState("")
  const [submaterial , setSubmaterial] = useState("")

  const fetchRawMaterials = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/rawmaterial/${uid}/${companyid}`);
      setRawmaterial(response.data);

      const uniqueCategories = [...new Set(response.data.map((item) => item.catogory))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching raw materials:", error);
    }
  };

  const addRawMaterial = async (category, item) => {
    const existingCategory = rawmaterial.find((mat) => mat.catogory === category);

    try {
      if (existingCategory) {
        const response = await axios.put(
          `http://localhost:3000/rawmaterial/${uid}/${companyid}/${existingCategory._id}`,
          { catogory: category, subrawmaterial: [{ name: item }] }
        );
        if (response.status === 200) {
          alert("Product successfully added");
          fetchRawMaterials();
        }
      } else {
        const response = await axios.post(`http://localhost:3000/rawmaterial/${uid}/${companyid}`, {
          catogory: category,
          subrawmaterial: [{ name: item }],
        });
        if (response.status === 201) {
          alert("Product successfully added");
          fetchRawMaterials();
          FetchParticularRawmaterial(category , item)
        }
      }
    } catch (e) {
      alert("Error adding raw material. Try again.");
    }
  };

  const FetchParticularRawmaterial = async (category , item)=>{

    const response = await axios.get(`http://localhost:3000/rawmaterial/${uid}/${companyid}/${category}/${item}`)

    if(response.status === 200){
      setRawmaterialid(response.data.id)
      setSubmaterial(response.data.submaterial)
    }

  }

  useEffect(() => {
    fetchRawMaterials();
  }, [companyid]);

  return { rawmaterial, categories, fetchRawMaterials, addRawMaterial   , rawmaterialid , submaterial ,FetchParticularRawmaterial };
};

export default useCreateRawmaterial;
