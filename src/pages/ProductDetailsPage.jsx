import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, BarChart3, DollarSign, Package } from "lucide-react";
import { 
  NavigationBar, 
  ReusablePieChart, 
  ReusableAreaChart, 
  SummaryCards 
} from "../components/common";

const ProductDetailsPage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { productData, allData, productIndex } = location.state || {};

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard", { state: { csvData: allData } });
  };

  if (!productData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationBar 
          title="Product Details"
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        <div className="container mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="text-gray-600">No product data available.</p>
            <button
              onClick={handleBackToDashboard}
              className="mt-4 flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Process product data for charts
  const sales = parseFloat(productData.Sales || productData.sales) || 0;
  const profit = parseFloat(productData.Profit || productData.profit) || 0;
  const expenses = parseFloat(productData.TE || productData.te || productData.Expenses) || 0;
  const credit = parseFloat(productData.Credit || productData.credit) || 0;
  const amazonFee = parseFloat(productData["Amazon Fee"] || productData["amazon fee"]) || 0;

  // Product-specific pie chart data
  const productPieData = [
    { name: "Profit", value: profit, color: "#10B981" },
    { name: "Expenses", value: expenses, color: "#EF4444" },
    { name: "Amazon Fee", value: amazonFee, color: "#F59E0B" },
    { name: "Credit", value: credit, color: "#8B5CF6" },
  ].filter(item => item.value > 0);

  // Summary cards for this product
  const productSummaryCards = [
    {
      title: "Sales",
      value: `$${sales.toLocaleString()}`,
      icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
      borderColor: "border-blue-500",
      iconBgColor: "bg-blue-100",
      valueColor: "text-blue-600"
    },
    {
      title: "Profit", 
      value: `$${profit.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
      borderColor: "border-green-500",
      iconBgColor: "bg-green-100", 
      valueColor: "text-green-600"
    },
    {
      title: "Total Expenses",
      value: `$${(expenses + amazonFee).toLocaleString()}`,
      icon: <Package className="w-6 h-6 text-red-600" />,
      borderColor: "border-red-500",
      iconBgColor: "bg-red-100",
      valueColor: "text-red-600"
    }
  ];

  const comparisonData = allData.slice(0, 5).map((row, index) => {
    const productName = row["Product Name"] || row["product name"] || row.Product || row.product || `Product ${index + 1}`;
    const truncatedName = productName.length > 15 ? productName.substring(0, 12) + "..." : productName;
    
    return {
      name: truncatedName,
      Sales: parseFloat(row.Sales || row.sales) || 0,
      Profit: parseFloat(row.Profit || row.profit) || 0,
      Expenses: parseFloat(row.TE || row.te || row.Expenses) || 0,
    };
  });

  const areaChartConfig = [
    { dataKey: "Sales", color: "#3B82F6" },
    { dataKey: "Profit", color: "#10B981" },
    { dataKey: "Expenses", color: "#EF4444" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar 
        title="Product Details"
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <div className="container mx-auto px-6 py-8">
        <button
          onClick={handleBackToDashboard}
          className="mb-6 flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {productData["Product Name"] || productData["product name"] || productData.Product || productData.product || `Product ${productIndex + 1}`}
          </h1>
          <p className="text-gray-600">Detailed analysis for this product</p>
        </div>

        <SummaryCards cards={productSummaryCards} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ReusablePieChart
            data={productPieData}
            title="Product Financial Breakdown"
            colors={["#10B981", "#EF4444", "#F59E0B", "#8B5CF6"]}
            height={350}
          />

          {/* Comparison Area Chart */}
          <ReusableAreaChart
            data={comparisonData}
            title="Product Comparison (Top 5)"
            areas={areaChartConfig}
            height={350}
          />
        </div>

        {/* Product Details Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Product Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(productData).map(([key, value]) => (
              <div key={key} className="border border-gray-200 rounded-lg p-4">
                <dt className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                  {key}
                </dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {value}
                </dd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
