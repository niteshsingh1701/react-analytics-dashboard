import React, { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { BarChart3, Bot, DollarSign, Package, ShoppingBag } from "lucide-react";

import {
  NavigationBar,
  ReusablePieChart,
  ReusableAreaChart,
  SummaryCards,
} from "../components/common";

const DashboardPage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const csvData = useMemo(
    () => location.state?.csvData || [],
    [location.state?.csvData]
  );
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleRowClick = (rowData, index) => {
    navigate(`/product/${index}`, {
      state: {
        productData: rowData,
        allData: csvData,
        productIndex: index,
      },
    });
  };

  const sidebarTabs = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    { id: "chatbot", name: "Chatbot", icon: <Bot className="w-5 h-5" /> },
    { id: "profit", name: "Profit", icon: <DollarSign className="w-5 h-5" /> },
    {
      id: "amazon",
      name: "Amazon Integration",
      icon: <Package className="w-5 h-5" />,
    },
    {
      id: "shopify",
      name: "Shopify Integration",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
  ];

  // Process CSV data for charts - FIXED CALCULATION
  const chartData = useMemo(() => {
    if (csvData.length === 0) return null;

    // Get column names dynamically from CSV headers
    const headers = Object.keys(csvData[0]);

    // Case-insensitive header matching
    const salesCol =
      headers.find((h) => h.toLowerCase().includes("sales")) || "Sales";
    const profitCol =
      headers.find((h) => h.toLowerCase().includes("profit")) || "Profit";
    const expensesCol =
      headers.find(
        (h) =>
          h.toLowerCase().includes("te") || h.toLowerCase().includes("expense")
      ) || "TE";
    const productCol =
      headers.find(
        (h) =>
          h.toLowerCase().includes("product") ||
          h.toLowerCase().includes("name")
      ) || headers[0];

    // Calculate totals from actual CSV data
    const totalSales = csvData.reduce(
      (sum, row) => sum + (parseFloat(row[salesCol]) || 0),
      0
    );
    const totalProfit = csvData.reduce(
      (sum, row) => sum + (parseFloat(row[profitCol]) || 0),
      0
    );
    const totalExpenses = csvData.reduce(
      (sum, row) => sum + (parseFloat(row[expensesCol]) || 0),
      0
    );

    // ✅ Remaining = Sales - (Profit + Expenses)
    const remaining = Math.max(totalSales - (totalProfit + totalExpenses), 0);

    // ✅ Pie chart shows parts of Sales, not Sales itself
    const pieData = [
      { name: "Profit", value: totalProfit, color: "#10B981" }, // green
      { name: "Expenses", value: totalExpenses, color: "#EF4444" }, // red
      { name: "Other Costs", value: remaining, color: "#F59E0B" }, // amber
    ];

    // Area chart data per product
    const areaData = csvData.map((row, index) => ({
      name: row[productCol] || `Product ${index + 1}`,
      Sales: parseFloat(row[salesCol]) || 0,
      Profit: parseFloat(row[profitCol]) || 0,
      Expenses: parseFloat(row[expensesCol]) || 0,
      Credit: parseFloat(row["Credit"] || row["CREDIT"] || row["credit"]) || 0,
      AmazonFee:
        parseFloat(
          row["Amazon Fee"] || row["AMAZON FEE"] || row["amazon fee"]
        ) || 0,
      ProfitPercentage:
        parseFloat(
          row["Profit Percentage"] ||
            row["PROFIT PERCENTAGE"] ||
            row["profit percentage"]
        ) || 0,
    }));

    // Summary cards data
    const summaryCardsData = [
      {
        title: "Total Sales",
        value: `$${totalSales.toLocaleString()}`,
        icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
        borderColor: "border-blue-500",
        iconBgColor: "bg-blue-100",
        valueColor: "text-blue-600",
      },
      {
        title: "Total Profit",
        value: `$${totalProfit.toLocaleString()}`,
        icon: <DollarSign className="w-6 h-6 text-green-600" />,
        borderColor: "border-green-500",
        iconBgColor: "bg-green-100",
        valueColor: "text-green-600",
      },
      {
        title: "Total Expenses",
        value: `$${totalExpenses.toLocaleString()}`,
        icon: <Package className="w-6 h-6 text-red-600" />,
        borderColor: "border-red-500",
        iconBgColor: "bg-red-100",
        valueColor: "text-red-600",
      },
    ];

    // Area chart configuration
    const areaChartConfig = [
      { dataKey: "Sales", color: "#3B82F6" },
      { dataKey: "Profit", color: "#10B981" },
      { dataKey: "Expenses", color: "#EF4444" },
    ];

    return {
      totals: { totalSales, totalProfit, totalExpenses, remaining },
      pieData,
      areaData,
      summaryCardsData,
      areaChartConfig,
    };
  }, [csvData]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation bar */}
      <NavigationBar
        title="Dashboard"
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {csvData.length === 0 ? (
        <div className="container mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Data Dashboard</h2>
            <p className="text-orange-600 font-semibold">
              📁 No data uploaded yet
            </p>
            <p className="text-gray-600 mt-2">
              Please upload a CSV file to view the dashboard with charts and
              clickable table.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white shadow-lg min-h-screen">
            <nav className="mt-6">
              {sidebarTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 border-r-4 border-blue-500 text-blue-700"
                      : "text-gray-700"
                  }`}
                >
                  <span className="mr-3 text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Data Analytics
              </h2>

              {/* Interactive Charts Section - AREA CHART IMPLEMENTATION */}
              {chartData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* PIE CHART - Using Reusable Component */}
                  <ReusablePieChart
                    data={chartData.pieData}
                    title="Financial Overview"
                    colors={["#10B981", "#EF4444", "#F59E0B"]}
                    height={350}
                  />

                  {/* AREA CHART - Using Reusable Component */}
                  <ReusableAreaChart
                    data={chartData.areaData}
                    title="Product Performance Trends"
                    areas={chartData.areaChartConfig}
                    height={350}
                  />
                </div>
              )}

              {/* Summary Cards */}
              {chartData && <SummaryCards cards={chartData.summaryCardsData} />}

              {/* Data Table Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Uploaded Data ({csvData.length} records) - Click any row for
                  details
                </h3>

                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-100">
                        {Object.keys(csvData[0]).map((header, index) => (
                          <th
                            key={index}
                            className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          onClick={() => handleRowClick(row, rowIndex)}
                          className="hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-200"
                        >
                          {Object.keys(csvData[0]).map((header, colIndex) => (
                            <td
                              key={colIndex}
                              className="px-4 py-3 text-sm text-gray-700"
                            >
                              {row[header]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
