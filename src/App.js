import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function App() {
  const [coins, setCoins] = useState([]);
  const [currency, setCurrency] = useState("usd");
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [chartDays, setChartDays] = useState(7);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=10&page=1&sparkline=false`
      )
      .then((res) => setCoins(res.data));
  }, [currency]);

  useEffect(() => {
    if (selectedCoin) {
      axios
        .get(
          `https://api.coingecko.com/api/v3/coins/${selectedCoin}/market_chart?vs_currency=${currency}&days=${chartDays}`
        )
        .then((res) => {
          const prices = res.data.prices;
          setChartData({
            labels: prices.map((p) => new Date(p[0]).toLocaleDateString()),
            datasets: [
              {
                label: `${selectedCoin.toUpperCase()} Price`,
                data: prices.map((p) => p[1]),
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
              },
            ],
          });
        });
    }
  }, [selectedCoin, currency, chartDays]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Crypto Price Tracker</h1>

      <div className="mb-6 flex justify-center gap-4">
        <select
          className="p-2 rounded border"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="usd">USD</option>
          <option value="inr">INR</option>
          <option value="eur">EUR</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coins.map((coin) => (
          <div
            key={coin.id}
            onClick={() => setSelectedCoin(coin.id)}
            className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <img src={coin.image} alt={coin.name} className="w-10 h-10" />
              <div>
                <h2 className="font-bold text-lg">{coin.name}</h2>
                <p className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</p>
              </div>
            </div>
            <p className="mt-2 text-xl font-semibold text-blue-600">
              {coin.current_price} {currency.toUpperCase()}
            </p>
          </div>
        ))}
      </div>

      {selectedCoin && chartData && (
        <div className="mt-10 bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-700">
              {selectedCoin.toUpperCase()} Price Chart
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setChartDays(7)}
                className={`px-3 py-1 rounded ${chartDays === 7 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                7 Days
              </button>
              <button
                onClick={() => setChartDays(30)}
                className={`px-3 py-1 rounded ${chartDays === 30 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                30 Days
              </button>
            </div>
          </div>
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
}

export default App;
