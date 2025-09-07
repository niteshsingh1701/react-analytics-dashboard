import React from "react";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  DollarSign,
  Eye,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const ShopifyDashboard = ({ formData }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Welcome to {formData.storeName}
        </h2>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">$8,432</p>
              <p className="text-xs text-green-600 flex items-center">
                <ArrowUp className="w-3 h-3 mr-1" />
                +15.3% vs last period
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Orders</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
              <p className="text-xs text-green-600 flex items-center">
                <ArrowUp className="w-3 h-3 mr-1" />
                +23.1% vs last period
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sessions</p>
              <p className="text-2xl font-bold text-gray-900">2,847</p>
              <p className="text-xs text-red-600 flex items-center">
                <ArrowDown className="w-3 h-3 mr-1" />
                -5.2% vs last period
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion</p>
              <p className="text-2xl font-bold text-gray-900">5.48%</p>
              <p className="text-xs text-green-600 flex items-center">
                <ArrowUp className="w-3 h-3 mr-1" />
                +0.8% vs last period
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Sales over time
          </h3>
          <div className="h-48 bg-gradient-to-r from-green-50 to-green-100 rounded-lg flex items-end justify-around p-4">
            {[40, 65, 45, 80, 60, 95, 70].map((height, index) => (
              <div
                key={index}
                className="bg-green-500 rounded-t-md w-8 transition-all hover:bg-green-600"
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Top products by units sold
          </h3>
          <div className="space-y-4">
            {[
              {
                name: "Wireless Bluetooth Headphones",
                sales: "$1,234",
                units: "42",
                percentage: 85,
              },
              {
                name: "Smartphone Case Premium",
                sales: "$890",
                units: "28",
                percentage: 65,
              },
              {
                name: "USB-C Fast Charger",
                sales: "$567",
                units: "31",
                percentage: 45,
              },
              {
                name: "Laptop Stand Adjustable",
                sales: "$445",
                units: "15",
                percentage: 30,
              },
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">
                    {product.name}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${product.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-12">
                      {product.units} sold
                    </span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="font-semibold text-gray-800">{product.sales}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent orders
          </h3>
          <div className="space-y-3">
            {[
              {
                id: "#1001",
                customer: "John Smith",
                amount: "$124.99",
                status: "Fulfilled",
                time: "2 min ago",
              },
              {
                id: "#1002",
                customer: "Sarah Johnson",
                amount: "$89.50",
                status: "Processing",
                time: "1 hour ago",
              },
              {
                id: "#1003",
                customer: "Mike Davis",
                amount: "$234.99",
                status: "Pending",
                time: "3 hours ago",
              },
              {
                id: "#1004",
                customer: "Lisa Wilson",
                amount: "$67.25",
                status: "Fulfilled",
                time: "5 hours ago",
              },
            ].map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-800">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                  <p className="text-xs text-gray-500">{order.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{order.amount}</p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      order.status === "Fulfilled"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Processing"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Store Analytics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Store analytics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Online store sessions</span>
              <span className="font-semibold text-gray-800">2,847</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Returning customer rate</span>
              <span className="font-semibold text-gray-800">27.3%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Average order value</span>
              <span className="font-semibold text-gray-800">$54.09</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total customers</span>
              <span className="font-semibold text-gray-800">1,247</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-green-700 font-medium">
                Store health score
              </span>
              <span className="font-bold text-green-600">89/100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopifyDashboard;
