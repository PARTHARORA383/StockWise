import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useCompany } from "./Companycontext";
import ChartLoader from "./loader";

import axios from "axios";
import {

  Chart as ChartJS,
  BarElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";


ChartJS.register(BarElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

const PurchaseTrends = () => {
  const uid = JSON.parse(localStorage.getItem("uid"))
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { selectedCompany } = useCompany();

  useEffect(() => {
    const FetchData = async () => {
      try {
        // Fetch purchase and sales data
        const purchaseResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/Purchase/${uid}/${selectedCompany}`
        );
        const salesResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/Sales/${uid}/${selectedCompany}`
        );

        // Group data by month
        const groupedPurchase = groupByMonth(purchaseResponse.data);
        const groupedSales = groupByMonth(salesResponse.data);

        // Merge labels from both datasets
        const allLabels = Array.from(
          new Set([...Object.keys(groupedPurchase), ...Object.keys(groupedSales)])
        );

        // Align data for both datasets
        const purchaseValues = allLabels.map(
          (label) => groupedPurchase[label] || 0
        );
        const salesValues = allLabels.map(
          (label) => groupedSales[label] || 0
        );

        // Update chart data
        setChartData({
          labels: allLabels,
          datasets: [
            {
              label: "Purchases (Rs)",
              data: purchaseValues,
              backgroundColor: "rgba(13, 148, 136, 0.8)", // Teal with opacity
              borderColor: "#0d9488",
              borderWidth: 2,
              borderRadius: 8,
              barThickness: 22,
              hoverBackgroundColor: "#0d9488",
              hoverBorderColor: "#0f766e",
            },
            {
              label: "Sales (Rs)", 
              data: salesValues,
              backgroundColor: "rgba(45, 212, 191, 0.7)", // Lighter teal with opacity
              borderColor: "#2dd4bf",
              borderWidth: 2,
              borderRadius: 8,
              barThickness: 22,
              hoverBackgroundColor: "#2dd4bf",
              hoverBorderColor: "#14b8a6",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    FetchData();
  }, [selectedCompany]);

  const groupByMonth = (data) => {
    const grouped = {};
    data.forEach((item) => {
      const date = new Date(item.date);
      const month = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      grouped[month] = (grouped[month] || 0) + item.total_amount;
    });
    return grouped;
  };

  if (loading) {
    return (

       <ChartLoader/>
    
    );
  }

  if (!chartData) {
    return (
      <div className="flex justify-center items-center h-96 lg:h-72">
        <div className="text-teal-600 text-lg">No data available to display.</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-teal-50 to-white rounded-xl shadow-xl border border-teal-100">
      
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              align: "end",
              labels: {
                usePointStyle: true,
                pointStyle: "circle",
                padding: 20,
                font: {
                  size: 13,
                  family: "Poppins",
                  weight: "500"
                },
                color: "#0f766e",
              },
            },
            title: {
              display: true,
              text: "Monthly Purchases and Sales Analysis",
              font: {
                size: 20,
                family: "Poppins",
                weight: "400"
              },
              color: "#0f766e",
              padding: {
                bottom: 10
              }
            },
            tooltip: {
              backgroundColor: "rgba(13, 148, 136, 0.9)",
              titleFont: {
                size: 14,
                family: "Poppins"
              },
              bodyFont: {
                size: 13,
                family: "Poppins"
              },
              padding: 12,
              cornerRadius: 8,
              displayColors: false
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                font: {
                  size: 12,
                  family: "Poppins",
                  weight: "500"
                },
                color: "#0f766e"
              },
              title: {
                display: true,
                text: "Timeline",
                font: {
                  size: 14,
                  family: "Poppins",
                  weight: "600"
                },
                color: "#0f766e",
                padding: {
                  top: 10
                }
              }
            },
            y: {
              grid: {
                color: "rgba(13, 148, 136, 0.1)",
                drawBorder: false
              },
              ticks: {
                display: true,
                font: {
                  size: 12,
                  family: "Poppins"
                },
                color: "#0f766e",
                callback: (value) => `₹${value.toLocaleString()}`
              },
              title: {
                display: true,
                text: "Amount (Rs)",
                font: {
                  size: 14,
                  family: "Poppins",
                  weight: "600"
                },
                color: "#0f766e"
              },
              beginAtZero: true,
      
              min: 0,
              ticks: {
                stepSize: 2000
              }
            }
          },
          animation: {
            duration: 1500,
            easing: 'easeInOutQuart'
          }
        }}
      />
    </div>
  );
};

export default PurchaseTrends;
