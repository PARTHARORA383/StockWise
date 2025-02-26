import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { useCompany } from "./Companycontext";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const uid = JSON.parse(localStorage.getItem("uid"));

const PieChart = () => {
  const [purchase, setPurchase] = useState(0);
  const [sales, setSales] = useState(0);
  const [expense, setExpense] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { selectedCompany } = useCompany();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [purchaseRes, salesRes, expenseRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/purchase/${uid}/${selectedCompany}`),
          axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/Sales/${uid}/${selectedCompany}`),
          axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/Expense/${uid}/${selectedCompany}`)
        ]);
        
        setPurchase(purchaseRes.data);
        setSales(salesRes.data);
        setExpense(expenseRes.data);

        console.log(purchaseRes.data);
        console.log(salesRes.data);
        console.log(expenseRes.data);

        const purchaseTotal = purchaseRes.data.reduce((sum, item) => sum + item.total_amount, 0); 
        const salesTotal = salesRes.data.reduce((sum, item) => sum + item.total_amount, 0);
        const expenseTotal = expenseRes.data.fetchExpenses.reduce((sum, item) => sum + item.expenseAmount, 0);

        setChartData({
          labels: ['Purchases', 'Sales', 'Expenses'],
          datasets: [
            {
              data: [purchaseTotal, salesTotal, expenseTotal],
              backgroundColor: [
                'rgba(13, 148, 136, 0.8)',  // Teal
                'rgba(45, 212, 191, 0.7)',  // Light teal
                'rgba(94, 234, 212, 0.7)'   // Lighter teal
              ],
              borderColor: [
                '#0d9488',
                '#2dd4bf', 
                '#5eead4'
              ],
              borderWidth: 2
            }
          ]
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 lg:h-72">
        
        <div className="text-teal-600 text-lg rounded-full animate-spin w-5 h-5 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="flex justify-center items-center h-72">
        <div className="text-teal-600 text-lg">No data available to display.</div>
      </div>
    );
  }

  return (
  <div className="h-full w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-xl border border-teal-100">
      <Pie
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              align: 'center',
              labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                padding: 20,
                font: {
                  size: 13,
                  family: 'Poppins',
                  weight: '500'
                },
                color: '#0f766e'
              }
            },
            title: {
              display: true,
              text: 'Financial Distribution Overview',
              font: {
                size: 20,
                family: 'Poppins',
                weight: '400'
              },
              color: 'rgb(30 , 30 , 30)',
              padding: {
                bottom: 20
              }
            },
            tooltip: {
              backgroundColor: 'rgba(13, 148, 136, 0.9)',
              titleFont: {
                size: 14,
                family: 'Poppins'
              },
              bodyFont: {
                size: 13,
                family: 'Poppins'
              },
              padding: 12,
              cornerRadius: 8,
              callbacks: {
                label: function(context) {
                  const value = context.raw;
                  return `₹${value.toLocaleString()}`;
                }
              }
            }
          },
          animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1500,
            easing: 'easeInOutQuart'
          }
        }}
      />
    </div>
  );
};


export default PieChart;
