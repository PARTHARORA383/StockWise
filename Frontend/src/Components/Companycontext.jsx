import React, { createContext, useContext, useState , useEffect} from 'react';

// Create a context for managing selected company state
const CompanyContext = createContext();

// Provider component to wrap around your application
export const CompanyProvider = ({ children }) => {
  const [selectedCompany, setSelectedCompany] = useState(() => {
    // Load selectedCompany from localStorage if available
    const savedCompany = localStorage.getItem('selectedCompany');
    return savedCompany ? JSON.parse(savedCompany) : null;
  });
    
  const[selected , setSelected] = useState()
  const[Registercompany , setRegistercompany] = useState(false)
  const[Purchase , setPurchase] = useState(false)
  const[selectedrawmaterial , setSelectedrawmaterial] = useState()
  const[selectedsubrawmaterial , setSelectedsubrawmaterial] = useState()
  const[selectedProductid , setSelectedProductid] = useState()
  const[selectedProduct , setSelectedProduct] = useState()  
  const[selectedrange, setSelectedrange] = useState("")  
  const[totalPurchaseAmount, setTotalPurchaseAmount] = useState(0)
  const[totalSaleAmount, setTotalSaleAmount] = useState(0)
  const [rendercompany , setRendercompany] = useState(false)
  
  useEffect(() => {
    // Store selectedCompany in localStorage whenever it changes
    if (selectedCompany) {
      localStorage.setItem('selectedCompany', JSON.stringify(selectedCompany));
      console.log(selectedCompany)
    }
  }, [selectedCompany]);


  return (
    <CompanyContext.Provider value={{ selected , setSelected,  selectedCompany, setSelectedCompany  , Registercompany , setRegistercompany , Purchase , setPurchase , selectedsubrawmaterial , setSelectedsubrawmaterial , selectedrawmaterial , setSelectedrawmaterial , selectedProductid , setSelectedProductid , selectedProduct , setSelectedProduct , selectedrange, setSelectedrange , totalPurchaseAmount, setTotalPurchaseAmount  , totalSaleAmount, setTotalSaleAmount , rendercompany , setRendercompany}}>
      {children}
    </CompanyContext.Provider>
  );
};

// Custom hook to use the Company context
export const useCompany = () => {
  return useContext(CompanyContext);
};

export default  CompanyContext