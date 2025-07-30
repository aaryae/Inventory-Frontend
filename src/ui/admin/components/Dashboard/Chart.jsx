import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import React, { useMemo, useState } from "react";
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
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState("paginated");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  // Transform and process data
  const processedData = useMemo(() => {
    if (!data || !data[activeCategory]) return [];

    const categoryData = data[activeCategory];
    const rawData = categoryData.data || categoryData;

    let dataArray = Object.entries(rawData).map(([key, value]) => ({
      name: key,
      count: value,
    }));

    // Apply search filter
    if (searchTerm) {
      dataArray = dataArray.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort data
    dataArray.sort((a, b) => {
      return sortOrder === "desc" ? b.count - a.count : a.count - b.count;
    });

    return dataArray;
  }, [data, activeCategory, searchTerm, sortOrder]);

  // Get data for current view
  const chartData = useMemo(() => {
    switch (viewMode) {
      case "top":
        return processedData.slice(0, 10); // Show top 10
      case "paginated": {
        const startIndex = currentPage * itemsPerPage;
        return processedData.slice(startIndex, startIndex + itemsPerPage);
      }
      case "all":
      default:
        return processedData;
    }
  }, [processedData, viewMode, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const totalItems = processedData.length;

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

  // Reset pagination when category changes
  React.useEffect(() => {
    setCurrentPage(0);
    setSearchTerm("");
  }, [activeCategory]);

  if (!data) {
    return (
      <div className="bg-[#171821] rounded-2xl shadow-xl  p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white ">{title}</h2>
        </div>
        <div className="flex items-center justify-center h-96 ">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray- rounded-full flex items-center justify-center">
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
    <div className="bg-[#171821] rounded-2xl shadow-xl  overflow-hidden">
      {/* Header Section */}
      <div className="px-8 pt-8 pb-6 bg-[#171821]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
              <span>
                Showing {chartData.length} of {totalItems}
              </span>
            </div>
            <div className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2`}
                style={{ backgroundColor: activeConfig.barColor }}
              ></div>
              <span>
                Total:{" "}
                {processedData.reduce((sum, item) => sum + item.count, 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeCategory === category.key
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                  : "bg-white text-gray-600 hover:text-gray-800 shadow-md hover:shadow-lg border border-gray-200"
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

        {/* Controls Section */}
        <div className="space-y-4">
          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={`Search ${activeConfig.label.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2  transition-all duration-200"
              />
            </div>

            {/* Sort Order */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2   transition-all duration-200 "
            >
              <option className="text-black" value="desc">
                Highest to Lowest
              </option>
              <option className="text-black" value="asc">
                Lowest to Highest
              </option>
            </select>
          </div>

          {/* View Mode Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* View Mode Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("top")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === "top"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Top 10
              </button>
              <button
                onClick={() => setViewMode("paginated")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === "paginated"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Paginated
              </button>
              <button
                onClick={() => setViewMode("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === "all"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Show All
              </button>
            </div>

            {/* Items per page (only for paginated mode) */}
            {viewMode === "paginated" && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Items per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(0);
                  }}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm "
                >
                  <option className="text-black" value={5}>
                    5
                  </option>
                  <option className="text-black" value={10}>
                    10
                  </option>
                  <option className="text-black" value={15}>
                    15
                  </option>
                  <option className="text-black" value={20}>
                    20
                  </option>
                </select>
              </div>
            )}
          </div>

          {/* Pagination (only for paginated mode) */}
          {viewMode === "paginated" && totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {currentPage + 1} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i;
                    } else if (currentPage < 3) {
                      pageNum = i;
                    } else if (currentPage > totalPages - 4) {
                      pageNum = totalPages - 5 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                  }
                  disabled={currentPage === totalPages - 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-8">
        <div className="bg-[#21222d] rounded-xl shadow-inner  p-6">
          <div
            className={`${
              viewMode === "all" && chartData.length > 20 ? "h-[600px]" : "h-96"
            }`}
          >
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

                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={chartData.length > 15 ? 9 : 11}
                  fontWeight={500}
                  angle={chartData.length > 10 ? -45 : 0}
                  textAnchor={chartData.length > 10 ? "end" : "middle"}
                  height={chartData.length > 10 ? 80 : 60}
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
          <div className="bg-[#21222d] rounded-xl p-4 text-white">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
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
                <p className="text-sm font-medium text-white">
                  {viewMode === "top"
                    ? "Top Items"
                    : viewMode === "paginated"
                    ? "Current Page"
                    : "Total Items"}
                </p>
                <p className="text-xl font-bold text-[#ffffffc4]">
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
                <p className="text-xl font-bold text-gray-900">
                  {maxValue || 0}
                </p>
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
                <p className="text-sm font-medium text-gray-600">
                  {viewMode === "paginated" ? "Page Total" : "Visible Total"}
                </p>
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
