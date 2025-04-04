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
  const[totalExpenseAmount, setTotalExpenseAmount] = useState(0)
  const [rendercompany , setRendercompany] = useState(false)
  const [showProductList , setShowProductList] = useState(false)
  const [showVendor , setShowVendor] = useState(false)
  const[uid , setUid] = useState("")
  const[selectedDates , setSelectedDates] = useState(new Date())
  const[vendor , setVendor] = useState()
  
  useEffect(() => {
    // Store selectedCompany in localStorage whenever it changes
    if (selectedCompany) {
      localStorage.setItem('selectedCompany', JSON.stringify(selectedCompany));
      console.log(selectedCompany)
    }
  }, [selectedCompany]);


  return (
    <CompanyContext.Provider value={{ selected , setSelected,  selectedCompany, setSelectedCompany  , Registercompany , setRegistercompany , Purchase , setPurchase , selectedsubrawmaterial , setSelectedsubrawmaterial , selectedrawmaterial , setSelectedrawmaterial , selectedProductid , setSelectedProductid , selectedProduct , setSelectedProduct , selectedrange, setSelectedrange , totalPurchaseAmount, setTotalPurchaseAmount  , totalSaleAmount, setTotalSaleAmount , totalExpenseAmount, setTotalExpenseAmount, rendercompany , setRendercompany , uid , setUid , selectedDates  , setSelectedDates , vendor , setVendor , showProductList , setShowProductList , showVendor , setShowVendor } }>
      {children}
    </CompanyContext.Provider>
  );
};

// Custom hook to use the Company context
export const useCompany = () => {
  return useContext(CompanyContext);
};

export default  CompanyContext