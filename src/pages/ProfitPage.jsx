import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BarChart3, Bot, DollarSign, Package, ShoppingBag } from "lucide-react";
import {
  NavigationBar,
  Sidebar,
} from "../components/common";

function ProfitPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation bar */}
      <NavigationBar
        title="Profit Analytics"
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          tabs={sidebarTabs}
          activeTab="profit"
          useRouter={true}
        />

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <DollarSign className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-green-600 mb-4">
                Profit Page
              </h2>
              <p className="text-gray-600 text-lg">
                This is where product-wise profit details with graphs and charts will be displayed.
              </p>
              <div className="mt-8 p-6 bg-green-50 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  Coming Soon
                </h3>
                <p className="text-green-700">
                  Product-wise profit analysis with interactive charts and detailed breakdowns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfitPage;
