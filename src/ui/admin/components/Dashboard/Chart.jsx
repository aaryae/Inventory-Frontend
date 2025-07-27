import { useState } from "react";

const Chart = ({ title, data, color = "blue" }) => {
  const [activeCategory, setActiveCategory] = useState("resourceType");

  // Mock data for resource counts by different categories
  const chartData = {
    resourceType: [
      { name: "Keyboard", count: 25 },
      { name: "Mouse", count: 49 },
      { name: "Laptop", count: 12 },
      { name: "Monitor", count: 18 },
      { name: "Headphones", count: 8 },
    ],
    specification: [
      { name: "Wireless", count: 35 },
      { name: "Wired", count: 42 },
      { name: "Bluetooth", count: 15 },
      { name: "USB-C", count: 28 },
    ],
    brand: [
      { name: "Logitech", count: 32 },
      { name: "Dell", count: 18 },
      { name: "HP", count: 15 },
      { name: "Samsung", count: 12 },
      { name: "Apple", count: 8 },
    ],
    model: [
      { name: "K380", count: 15 },
      { name: "M185", count: 22 },
      { name: "Latitude 5520", count: 8 },
      { name: "Pavilion", count: 12 },
      { name: "Galaxy Tab", count: 6 },
    ],
  };

  const categories = [
    { key: "resourceType", label: "Resource Type" },
    { key: "specification", label: "Specification" },
    { key: "brand", label: "Brand" },
    { key: "model", label: "Model" },
  ];

  const currentData = chartData[activeCategory];

  const colorClasses = {
    blue: "from-blue-500 to-cyan-500",
    green: "from-green-400 to-cyan-400",
    purple: "from-purple-500 to-indigo-500",
    yellow: "from-yellow-400 to-orange-400",
  };

  const bgColor = colorClasses[color] || colorClasses.blue;

  // Calculate SVG path for smooth line chart - responsive width
  const chartHeight = 200;
  const padding = 60;
  const maxValue = Math.max(...currentData.map((item) => item.count));

  const createPoints = (containerWidth) => {
    const chartWidth = containerWidth;
    return currentData.map((item, index) => {
      const x =
        padding +
        (index * (chartWidth - 2 * padding)) / (currentData.length - 1);
      const y =
        chartHeight -
        padding -
        (item.count / maxValue) * (chartHeight - 2 * padding);
      return { x, y, count: item.count, name: item.name };
    });
  };

  // Create smooth curve path
  const createSmoothPath = (points) => {
    if (points.length < 2) return "";

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];

      if (next) {
        // Calculate control points for smooth curve
        const cp1x = prev.x + (curr.x - prev.x) * 0.5;
        const cp1y = prev.y;
        const cp2x = curr.x - (next.x - curr.x) * 0.5;
        const cp2y = curr.y;

        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      } else {
        // Last point - straight line
        path += ` L ${curr.x} ${curr.y}`;
      }
    }

    return path;
  };

  const ChartSVG = ({ containerWidth }) => {
    const points = createPoints(containerWidth);
    const linePath = createSmoothPath(points);
    const areaPath =
      linePath +
      ` L ${points[points.length - 1].x} ${chartHeight - padding} L ${
        points[0].x
      } ${chartHeight - padding} Z`;

    return (
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${containerWidth} ${chartHeight}`}
      >
        {/* Definitions for gradients */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
          <line
            key={index}
            x1={padding}
            y1={chartHeight - padding - ratio * (chartHeight - 2 * padding)}
            x2={containerWidth - padding}
            y2={chartHeight - padding - ratio * (chartHeight - 2 * padding)}
            stroke="#374151"
            strokeWidth="1"
            strokeDasharray="5,5"
            opacity="0.3"
          />
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGradient)" opacity="0.6" />

        {/* Main line */}
        <path
          d={linePath}
          stroke="url(#lineGradient)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />

        {/* Data points with glow effect */}
        {points.map((point, index) => (
          <g key={index}>
            {/* Glow circle */}
            <circle
              cx={point.x}
              cy={point.y}
              r="8"
              fill="url(#lineGradient)"
              opacity="0.3"
              filter="url(#glow)"
            />
            {/* Main circle */}
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill="url(#lineGradient)"
              stroke="#171821"
              strokeWidth="3"
            />
            {/* Inner highlight */}
            <circle
              cx={point.x}
              cy={point.y}
              r="3"
              fill="white"
              opacity="0.8"
            />
            {/* Value label */}
            <text
              x={point.x}
              y={point.y - 20}
              textAnchor="middle"
              className="text-xs font-bold"
              fill="#06b6d4"
              style={{ fontSize: "12px", fontWeight: "600" }}
            >
              {point.count}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {points.map((point, index) => (
          <text
            key={index}
            x={point.x}
            y={chartHeight - 15}
            textAnchor="middle"
            className="text-xs"
            fill="#9ca3af"
            style={{ fontSize: "11px" }}
          >
            {point.name}
          </text>
        ))}
      </svg>
    );
  };

  return (
    <div
      className="w-full rounded-2xl border border-[#21222d] shadow-lg"
      style={{ background: "#171821" }}
    >
      <div className="p-6 border-b border-[#21222d]">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-100">
            {title || "Resource Analytics Dashboard"}
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"></div>
              <span className="text-xs text-slate-400">Resource Count</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeCategory === category.key
                  ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-[#21222d]"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Chart Container */}
        <div className="relative h-64 w-full">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-400 z-10">
            <span>{maxValue}</span>
            <span>{Math.round(maxValue * 0.75)}</span>
            <span>{Math.round(maxValue * 0.5)}</span>
            <span>{Math.round(maxValue * 0.25)}</span>
            <span>0</span>
          </div>

          {/* SVG Chart - Full width */}
          <div className="ml-8 h-full w-full">
            <div className="w-full h-fit">
              <ChartSVG containerWidth={1000} />
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            className="text-center p-3 rounded-lg"
            style={{ background: "#21222d" }}
          >
            <div className="text-2xl font-bold text-indigo-400">
              {currentData.reduce((sum, item) => sum + item.count, 0)}
            </div>
            <div className="text-xs text-slate-400">Total Resources</div>
          </div>
          <div
            className="text-center p-3 rounded-lg"
            style={{ background: "#21222d" }}
          >
            <div className="text-2xl font-bold text-green-400">
              {currentData.length}
            </div>
            <div className="text-xs text-slate-400">Categories</div>
          </div>
          <div
            className="text-center p-3 rounded-lg"
            style={{ background: "#21222d" }}
          >
            <div className="text-2xl font-bold text-yellow-400">
              {Math.max(...currentData.map((item) => item.count))}
            </div>
            <div className="text-xs text-slate-400">Highest Count</div>
          </div>
          <div
            className="text-center p-3 rounded-lg"
            style={{ background: "#21222d" }}
          >
            <div className="text-2xl font-bold text-purple-400">
              {Math.min(...currentData.map((item) => item.count))}
            </div>
            <div className="text-xs text-slate-400">Lowest Count</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chart;
