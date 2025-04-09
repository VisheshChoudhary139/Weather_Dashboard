import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TemperatureChart = ({ dailyData }) => {
  if (!dailyData || !dailyData.length) return <p>No forecast data available.</p>;

  const labels = dailyData.map(day =>
    new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })
  );

  const temperatures = dailyData.map(day => day.temp.day);

  const data = {
    labels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: temperatures,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "7-Day Temperature Forecast" },
    },
  };

  return <Line data={data} options={options} />;
};

export default TemperatureChart;
