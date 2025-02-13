
import { useState, useEffect } from "react";
import axios from "axios";
import { useCompany } from "./Companycontext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'


const Totalpurchaseandsale = ({ purchase, sale }) => {
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const { selectedrange, setSelectedrange, totalPurchaseAmount, setTotalPurchaseAmount, totalSaleAmount, setTotalSaleAmount , totalExpenseAmount, setTotalExpenseAmount } = useCompany(); // Default to last 7 days
  const [loading, setLoading] = useState(true);
  const { selectedCompany } = useCompany()
  const totaldisplayexpense = totalExpenseAmount + totalPurchaseAmount
  const Profit_loss = totalSaleAmount-(totaldisplayexpense)|| 0

  const [CheckProfitorLoss , setCheckProfitorLoss] = useState(false)
const uid = JSON.parse(localStorage.getItem("uid"))

  const handleProfitandLoss = ()=>{

    if(Profit_loss > 0 ){
      setCheckProfitorLoss(true)
    }
  }


  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/Purchase/${uid}/${selectedCompany}`);
        setPurchases(response.data);
      } catch (error) {
        console.error("Error fetching purchase data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  useEffect(() => {
    const FetchSales = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/Sales/${uid}/${selectedCompany}`)
        setSales(response.data)
      } catch (e) {
        alert("error fetching sales")
      }
    }
    FetchSales();
  }, [])

  useEffect(() => {
    const FetchExpense = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/Expense/${uid}/${selectedCompany}`)
        setExpenses(response.data.fetchExpenses)
      } catch (e) {
        alert("error fetching sales")
      }
    }
    FetchExpense();
  }, [])

  // Calculate total amount when the range or purchases change
  useEffect(() => {
    if (purchases.length > 0) {
      const filteredpurchase = filterPurchasesandSalesByDateRange(purchases, selectedrange);
      const totalpurchase = filteredpurchase.reduce((sum, purchase) => sum + purchase.total_amount_postGst, 0);
      setTotalPurchaseAmount(totalpurchase);
    }
  }, [purchases, selectedrange]);


  useEffect(() => {
    if (sales.length > 0) {
      const filteredsale = filterPurchasesandSalesByDateRange(sales, selectedrange)
      const totalsale = filteredsale.reduce((sum, sale) => sum + sale.total_amount_postGst, 0)
      setTotalSaleAmount(totalsale)
    }
  }, [sales, selectedrange])

  useEffect(() => {
    if (expenses.length > 0) {
      const filteredExpense = filterPurchasesandSalesByDateRange(expenses, selectedrange)
      const totalexpense = filteredExpense.reduce((sum, exp) => sum + exp.expenseAmount, 0)
      setTotalExpenseAmount(totalexpense)
    }
  }, [expenses, selectedrange])

  useEffect(()=>{

    handleProfitandLoss()
  }, [purchases , selectedrange , sales , expenses])



  // Function to filter purchases by date range
  const filterPurchasesandSalesByDateRange = (data, range) => {
    const now = new Date();
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      switch (range) {
        case "7": // Last 7 days
          return itemDate >= subtractDays(now, 7);
        case "14": // Last 14 days
          return itemDate >= subtractDays(now, 14);
        case "30": // Last 30 days
          return itemDate >= subtractDays(now, 30);
        case "`180": // Last 30 days
          return itemDate >= subtractDays(now, 180);
        case "365": // Last 1 year
          return itemDate >= subtractDays(now, 365);
        default:
          return true;
      }
    });
  };

  // Utility function to subtract days from a date
  const subtractDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  };

  if (loading) {
    return <p>Loading purchases...</p>;
  }

  return (
    <div className="flex">
      {purchase || expenses ? (<div
        className="h-32 bg-gradient-to-r  from-teal-800 to-teal-600 md:w-1/3  w-full m-5 mr-8 p-3 rounded-xl transition-transform transform hover:scale-105 ">
        <div className=" flex flex-col pl-3">

          <h2 className="text-lg text-opacity-90 text-white pb-7 pt-2">EXPENSES</h2>
          <h2 className=" text-3xl   text-white pb-2">  <FontAwesomeIcon icon = {faIndianRupeeSign}/>{ " "+
           
          totaldisplayexpense}</h2>
        </div>
      </div>) :

        (<div>


        </div>)}



      {sale ? (<div className=" h-32 bg-gradient-to-r from-teal-800 to-teal-600 md:w-1/3  w-full m-5 p-3 mr-8 rounded-xl transition-transform transform hover:scale-105">

        <div className=" flex flex-col pl-3">

          <h2 className="text-lg text-opacity-90 text-white pb-7 pt-2">SALES</h2>
          <h2 className=" text-3xl   text-white pb-2 "> <FontAwesomeIcon icon = {faIndianRupeeSign}/>{ " "+ totalSaleAmount}</h2>
        </div>
      </div>) : (
        <div>
        </div>
      )}


<div className=" h-32 bg-gradient-to-r from-teal-800 to-teal-600 md:w-1/3  w-full  m-5 p-3 mr-8 rounded-xl transition-transform transform hover:scale-105">

<div className=" flex flex-col pl-3">
  <h2 className="text-lg text-opacity-90 text-white pb-7 pt-2">{CheckProfitorLoss ? (<h1>  PROFIT</h1>) : (<h1>  LOSS</h1>)
}</h2>
  <h2 className=" text-3xl   text-white pb-2 "> <FontAwesomeIcon icon = {faIndianRupeeSign}/>{ " "+ Profit_loss}</h2>
  </div>
  </div>
</div>

  );
};

export default Totalpurchaseandsale;
