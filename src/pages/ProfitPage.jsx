import React, { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BarChart3, Bot, DollarSign, Package, ShoppingBag } from "lucide-react";
import {
  NavigationBar,
  Sidebar,
  ReusablePieChart,
  ReusableAreaChart,
} from "../components/common";
import { useCsvData } from "../hooks/useCsvData";

function ProfitPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { csvData } = useCsvData();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const profitAnalytics = useMemo(() => {
    if (!csvData || csvData.length === 0) {
      return {
        profitByProduct: [],
        profitTrends: [],
        topProducts: [],
        summaryStats: {
          totalRevenue: 0,
          totalProfit: 0,
          avgProfitMargin: 0,
          productCount: 0,
        },
      };
    }

    const sortedByProfit = [...csvData]
      .sort((a, b) => (parseFloat(b["Profit"]) || 0) - (parseFloat(a["Profit"]) || 0))
      .slice(0, 8);

    const colorPalette = [
      "#10B981", "#3B82F6", "#F59E0B", "#EF4444", 
      "#8B5CF6", "#06B6D4", "#F97316", "#84CC16"
    ];

    const profitByProduct = sortedByProfit.map((item, index) => ({
      name: (item["Product Name"] || "Unknown Product").length > 15 
        ? (item["Product Name"] || "Unknown Product").substring(0, 12) + "..." 
        : (item["Product Name"] || "Unknown Product"),
      value: parseFloat(item["Profit"]) || 0,
      fill: colorPalette[index] || `hsl(${(index * 45)}, 70%, 50%)`,
    }));

    const topForTrends = [...csvData]
      .sort((a, b) => (parseFloat(b["Profit"]) || 0) - (parseFloat(a["Profit"]) || 0))
      .slice(0, 10);

    const profitTrends = topForTrends.map((item, index) => ({
      name: (item["Product Name"] || `Product ${index + 1}`).substring(0, 10) + "...", // Truncate long names
      profit: parseFloat(item["Profit"]) || 0,
      sales: parseFloat(item["Sales"]) || 0,
      profitPercentage: parseFloat(item["Profit Percentage"]) || 0,
    }));

    // Get top 5 profitable products
    const topProducts = [...csvData]
      .sort((a, b) => (parseFloat(b["Profit"]) || 0) - (parseFloat(a["Profit"]) || 0))
      .slice(0, 5);

    // Calculate summary statistics
    const totalRevenue = csvData.reduce((sum, item) => sum + (parseFloat(item["Sales"]) || 0), 0);
    const totalProfit = csvData.reduce((sum, item) => sum + (parseFloat(item["Profit"]) || 0), 0);
    const avgProfitMargin = csvData.length > 0 
      ? csvData.reduce((sum, item) => sum + (parseFloat(item["Profit Percentage"]) || 0), 0) / csvData.length 
      : 0;

    return {
      profitByProduct,
      profitTrends,
      topProducts,
      summaryStats: {
        totalRevenue,
        totalProfit,
        avgProfitMargin,
        productCount: csvData.length,
      },
    };
  }, [csvData]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar
        title="Profit Analytics"
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <div className="flex">
        <Sidebar
          tabs={sidebarTabs}
          activeTab="profit"
          useRouter={true}
        />

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {!csvData || csvData.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <DollarSign className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-green-600 mb-4">
                  Profit Analytics
                </h2>
                <p className="text-gray-600 text-lg mb-6">
                  No data available. Please upload a CSV/Excel file to view profit analytics.
                </p>
                <button
                  onClick={() => navigate('/upload')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
                >
                  Upload Data
                </button>
              </div>
            ) : (
              // Profit analytics dashboard
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Product-wise Profit Analytics
                  </h1>
                  <p className="text-gray-600">
                    Detailed profit analysis and insights for {profitAnalytics.summaryStats.productCount} products
                  </p>
                </div>
                

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Profit Distribution by Product
                    </h3>
                    <ReusablePieChart
                      data={profitAnalytics.profitByProduct}
                      title="Product Profit Share"
                      height={400}
                      outerRadius={110}
                      showPercentage={true}
                    />
                  </div>

                  {/* Profit Trends Area Chart */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Product Performance Overview
                    </h3>
                    <ReusableAreaChart
                      data={profitAnalytics.profitTrends}
                      title="Profit by Product"
                      height={350}
                      areas={[
                        { dataKey: "profit", color: "#10B981" }
                      ]}
                      xAxisKey="name"
                    />
                  </div>
                </div>

                {/* Top Profitable Products Table */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Top 5 Most Profitable Products
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rank
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sales
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Profit
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Profit %
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amazon Fee
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {profitAnalytics.topProducts.map((product, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white ${
                                  index === 0 ? 'bg-yellow-500' : 
                                  index === 1 ? 'bg-gray-400' : 
                                  index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                                }`}>
                                  {index + 1}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {product["Product Name"]}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                ${(parseFloat(product["Sales"]) || 0).toLocaleString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-semibold text-green-600">
                                ${(parseFloat(product["Profit"]) || 0).toLocaleString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                (parseFloat(product["Profit Percentage"]) || 0) > 20 
                                  ? 'bg-green-100 text-green-800'
                                  : (parseFloat(product["Profit Percentage"]) || 0) > 10
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {(parseFloat(product["Profit Percentage"]) || 0).toFixed(1)}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${(parseFloat(product["Amazon Fee"]) || 0).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Additional Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Profit vs Sales Comparison */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Profit vs Sales Comparison
                    </h3>
                    <ReusableAreaChart
                      data={profitAnalytics.profitTrends}
                      title="Sales Performance"
                      height={250}
                      areas={[
                        { dataKey: "sales", color: "#3B82F6" }
                      ]}
                      xAxisKey="name"
                    />
                  </div>

                  {/* Profit Percentage Distribution */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Profit Margin Distribution
                    </h3>
                    <ReusableAreaChart
                      data={profitAnalytics.profitTrends}
                      title="Profit Margins (%)"
                      height={250}
                      areas={[
                        { dataKey: "profitPercentage", color: "#8B5CF6" }
                      ]}
                      xAxisKey="name"
                      yAxisFormatter={(value) => `${value.toFixed(1)}%`}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfitPage;
