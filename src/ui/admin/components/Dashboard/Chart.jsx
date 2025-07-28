import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Chart = ({ title, data }) => {
  const [activeCategory, setActiveCategory] = useState("specification");

  // Transform data for the chart
  const chartData = useMemo(() => {
    if (!data || !data[activeCategory]) return [];

    const categoryData = data[activeCategory];

    // Handle the nested response format
    const rawData = categoryData.data || categoryData;

    return Object.entries(rawData).map(([key, value]) => ({
      name: key,
      count: value,
    }));
  }, [data, activeCategory]);

  const categories = [
    {
      key: "specification",
      label: "Specification",
      color: "from-blue-500 to-blue-600",
      barColor: "#3b82f6",
    },
    {
      key: "model",
      label: "Model",
      color: "from-purple-500 to-purple-600",
      barColor: "#8b5cf6",
    },
    {
      key: "brand",
      label: "Brand",
      color: "from-emerald-500 to-emerald-600",
      barColor: "#10b981",
    },
    {
      key: "resourceType",
      label: "Resource Type",
      color: "from-amber-500 to-amber-600",
      barColor: "#f59e0b",
    },
  ];

  const activeConfig = categories.find((cat) => cat.key === activeCategory);

  if (!data) {
    return (
      <div className="bg-[#171821] rounded-2xl shadow-xl border  p-8 ">
        <div className="flex items-center justify-between mb-6 bg-[#171821]">
          <h2 className="text-2xl font-bold bg-[#171821]   bg-clip-text text-transparent">
            {title}
          </h2>
        </div>
        <div className="flex items-center justify-center h-96 text-gray-400">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#171821] rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-lg font-medium">No data available</p>
            <p className="text-sm">Chart data will appear here once loaded</p>
          </div>
        </div>
      </div>
    );
  }

  const totalCount = chartData.reduce((sum, item) => sum + item.count, 0);
  const maxValue = Math.max(...chartData.map((item) => item.count));

  return (
    <div className="bg-[#171821] rounded-2xl shadow-xl   overflow-hidden">
      {/* Header Section */}
      <div className="px-8 pt-8 pb-6 bg-[#171821] ">
        <div className="flex items-center justify-between mb-6 bg-[#171821]">
          <h2 className="text-2xl font-bold bg-white bg-clip-text text-transparent">
            {title}
          </h2>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
              <span>{chartData.length} items</span>
            </div>
            <div className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2`}
                style={{ backgroundColor: activeConfig.barColor }}
              ></div>
              <span>Total: {totalCount}</span>
            </div>
          </div>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeCategory === category.key
                  ? `bg-gradient-to-r ${
                      category.color
                    } text-white shadow-lg shadow-${
                      category.key === "specification"
                        ? "blue"
                        : category.key === "model"
                        ? "purple"
                        : category.key === "brand"
                        ? "emerald"
                        : "amber"
                    }-200`
                  : "bg-white text-gray-600 hover:text-gray-800 shadow-md hover:shadow-lg "
              }`}
            >
              <span className="relative z-10">{category.label}</span>
              {activeCategory !== category.key && (
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}
                ></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-8">
        <div className="bg-[#21222d] rounded-xl shadow-inner  p-6">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 80,
                }}
              >
                <defs>
                  <linearGradient
                    id={`gradient-${activeCategory}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={activeConfig.barColor}
                      stopOpacity={0.9}
                    />
                    <stop
                      offset="100%"
                      stopColor={activeConfig.barColor}
                      stopOpacity={0.6}
                    />
                  </linearGradient>
                </defs>
                {/* <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  strokeWidth={1}
                /> */}
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={11}
                  fontWeight={500}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                  tick={{ fill: "#64748b" }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  fontWeight={500}
                  tick={{ fill: "#64748b" }}
                  tickLine={{ stroke: "#e2e8f0" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    backdropFilter: "blur(10px)",
                    fontSize: "13px",
                    fontWeight: "500",
                  }}
                  labelStyle={{
                    color: "#1f2937",
                    fontWeight: "600",
                    marginBottom: "4px",
                    fontSize: "14px",
                  }}
                  itemStyle={{
                    color: activeConfig.barColor,
                    fontWeight: "600",
                  }}
                  cursor={{ fill: "rgba(59, 130, 246, 0.05)" }}
                />
                <Bar
                  dataKey="count"
                  fill={`url(#gradient-${activeCategory})`}
                  radius={[8, 8, 0, 0]}
                  name="Count"
                  stroke={activeConfig.barColor}
                  strokeWidth={1}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#21222d] rounded-xl p-4 ">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium  text-white">Total Items</p>
                <p className="text-xl font-bold text-white">
                  {chartData.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Highest Count
                </p>
                <p className="text-xl font-bold text-gray-900">{maxValue}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Count</p>
                <p className="text-xl font-bold text-gray-900">{totalCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chart;
