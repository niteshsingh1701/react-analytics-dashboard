import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const ReusablePieChart = ({
  data,
  title = "Chart",
  colors = ["#3B82F6", "#10B981", "#EF4444"],
  width = "100%",
  height = 350,
  outerRadius = 100,
  showPercentage = true,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        {title}
      </h3>
      <ResponsiveContainer width={width} height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => {
              if (showPercentage && percent > 0.05) {
                // Only show label if slice is > 5%
                return `${name}: ${(percent * 100).toFixed(1)}%`;
              }
              return "";
            }}
            outerRadius={Math.min(outerRadius, 120)}
            fill="#8884d8"
            dataKey="value"
            strokeWidth={2}
            stroke="#fff"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.fill || colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`$${value.toLocaleString()}`, ""]}
            labelStyle={{ color: "#374151" }}
            contentStyle={{
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ paddingTop: "20px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReusablePieChart;
