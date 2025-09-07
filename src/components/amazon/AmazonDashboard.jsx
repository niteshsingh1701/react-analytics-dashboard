import React from "react";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  Star,
  ArrowUp,
  Package,
} from "lucide-react";

const AmazonDashboard = ({ formData }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Welcome to Amazon Seller Page
        </h2>
        <p className="opacity-90">
          Store: <span className="font-bold capitalize">{formData.storeName}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-green-600">$12,450</p>
              <p className="text-xs text-green-500 flex items-center">
                <ArrowUp className="w-3 h-3 mr-1" />
                +12.5% from last month
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Orders</p>
              <p className="text-2xl font-bold text-blue-600">342</p>
              <p className="text-xs text-blue-500 flex items-center">
                <ArrowUp className="w-3 h-3 mr-1" />
                +8.2% from last week
              </p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Products</p>
              <p className="text-2xl font-bold text-purple-600">28</p>
              <p className="text-xs text-gray-500">Active listings</p>
            </div>
            <Package className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rating</p>
              <p className="text-2xl font-bold text-yellow-600">4.8</p>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Recent Orders & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Orders
          </h3>
          <div className="space-y-3">
            {[
              {
                id: "AMZ-001",
                product: "iPhone 14 Case",
                amount: "$24.99",
                status: "Shipped",
              },
              {
                id: "AMZ-002",
                product: "Wireless Charger",
                amount: "$39.99",
                status: "Processing",
              },
              {
                id: "AMZ-003",
                product: "Phone Stand",
                amount: "$15.99",
                status: "Delivered",
              },
              {
                id: "AMZ-004",
                product: "Screen Protector",
                amount: "$12.99",
                status: "Pending",
              },
            ].map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800">{order.product}</p>
                  <p className="text-sm text-gray-600">Order #{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{order.amount}</p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      order.status === "Shipped"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Performance Summary
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order Defect Rate</span>
              <span className="text-green-600 font-semibold">0.2%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "98%" }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Late Shipment Rate</span>
              <span className="text-green-600 font-semibold">1.5%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "95%" }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Customer Response Time</span>
              <span className="text-blue-600 font-semibold"> 1 hour</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: "90%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Top Performing Products
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: "iPhone 14 Pro Case",
              sales: "$2,450",
              units: "98 sold",
              rating: "4.9",
            },
            {
              name: "Wireless Charging Pad",
              sales: "$1,890",
              units: "76 sold",
              rating: "4.7",
            },
            {
              name: "Bluetooth Headphones",
              sales: "$3,200",
              units: "64 sold",
              rating: "4.8",
            },
          ].map((product, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <h4 className="font-medium text-gray-800 mb-2">{product.name}</h4>
              <div className="space-y-1">
                <p className="text-green-600 font-semibold">{product.sales}</p>
                <p className="text-sm text-gray-600">{product.units}</p>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">
                    {product.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AmazonDashboard;
