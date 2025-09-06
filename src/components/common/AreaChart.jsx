import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ReusableAreaChart = ({ 
  data, 
  title = "Chart", 
  width = "100%", 
  height = 350,
  areas = [],
  showGrid = true,
  rotateXAxisLabels = true,
  xAxisKey = "name",
  yAxisFormatter = (value) => `$${(value / 1000).toFixed(0)}k`
}) => {
  // Default gradient definitions
  const defaultGradients = {
    Sales: { id: "colorSales", color: "#3B82F6" },
    Profit: { id: "colorProfit", color: "#10B981" },
    Expenses: { id: "colorExpenses", color: "#EF4444" },
    Credit: { id: "colorCredit", color: "#8B5CF6" },
    AmazonFee: { id: "colorAmazonFee", color: "#F59E0B" },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        {title}
      </h3>
      <ResponsiveContainer width={width} height={height}>
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <defs>
            {areas.map((area) => {
              const gradient = defaultGradients[area.dataKey] || { 
                id: `color${area.dataKey}`, 
                color: area.color || "#3B82F6" 
              };
              return (
                <linearGradient
                  key={gradient.id}
                  id={gradient.id}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={gradient.color}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={gradient.color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              );
            })}
          </defs>

          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          )}
          
          <XAxis
            dataKey={xAxisKey}
            angle={rotateXAxisLabels ? -45 : 0}
            textAnchor={rotateXAxisLabels ? "end" : "middle"}
            height={rotateXAxisLabels ? 80 : 60}
            fontSize={10}
            stroke="#6b7280"
          />
          
          <YAxis
            formatter={yAxisFormatter}
            stroke="#6b7280"
            fontSize={11}
          />
          
          <Tooltip
            formatter={(value, name) => [
              `$${value.toLocaleString()}`,
              name,
            ]}
            labelStyle={{ color: "#374151", fontWeight: "bold" }}
            contentStyle={{
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          
          <Legend wrapperStyle={{ paddingTop: "10px" }} />

          {areas.map((area) => {
            const gradient = defaultGradients[area.dataKey] || { 
              id: `color${area.dataKey}`, 
              color: area.color || "#3B82F6" 
            };
            return (
              <Area
                key={area.dataKey}
                type="monotone"
                dataKey={area.dataKey}
                stroke={area.color || gradient.color}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#${gradient.id})`}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReusableAreaChart;
