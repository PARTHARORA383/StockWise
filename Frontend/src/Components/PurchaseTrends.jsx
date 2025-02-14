import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useCompany } from "./Companycontext";
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
          labels: allLabels, // Months on the X-axis
          datasets: [
            {
              label: "Purchases (Rs)",
              data: purchaseValues,
              backgroundColor: "#0d9488", // Light Blue for Purchases
              borderRadius: 4, // Rounded bar corners
              barThickness: 25, // Custom bar thickness
            },
            {
              label: "Sales (Rs)",
              data: salesValues,
              backgroundColor: "#A78BFA", // Light Purple for Sales
              borderRadius: 4,
              barThickness: 25,
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
      }); // e.g., "November 2024"
      grouped[month] = (grouped[month] || 0) + item.total_amount; // Sum up total_amount
    });
    return grouped;
  };

  if (loading) {
    return <p>Loading chart...</p>;
  }

  if (!chartData) {
    return <p>No data available to display.</p>;
  }

  return (
    <div className="h-72 w-full max-w-7xl mx-auto overflow-hidden p-4 bg-gray-50 rounded-lg shadow-lg">
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              labels: {
                font: {
                  size: 12,
                  family: "Poppins",
                },
                color: "#4b5563",
              },
            },
            title: {
              display: true,
              text: "Monthly Purchases and Sales (Rs)",
              font: {
                size: 18,
                family: "Poppins",
                weight: "bold",
              },
              color: "#111827",
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                font: {
                  size: 12,
                  family: "Poppins",
                },
                color: "#4b5563",
              },
              title: {
                display: true,
                text: "Months",
                font: {
                  size: 14,
                  family: "Poppins",
                  weight: "600",
                },
                color: "#111827",
              },
            },
            y: {
              grid: {
                color: "#e5e7eb",
              },
              ticks: {
                display: false, // Hides Y-axis numbers
              },
              title: {
                display: false, // Hides Y-axis title
              },
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default PurchaseTrends;
