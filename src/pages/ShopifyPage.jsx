import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BarChart3, Bot, DollarSign, Package, ShoppingBag } from "lucide-react";
import { NavigationBar, Sidebar } from "../components/common";
import ShopifyIntegrationForm from "../components/Shopify/ShopifyIntegrationForm";
import ShopifyDashboard from "../components/Shopify/ShopifyDashboard";

function ShopifyPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isIntegrated, setIsIntegrated] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    storeName: "",
    shopDomain: "",
  });

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email && formData.storeName) {
      setIsIntegrated(true);
    }
  };

  const handleDisconnect = () => {
    setIsIntegrated(false);
    setFormData({ email: "", storeName: ""});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar
        title="Shopify Integration"
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <div className="flex">
        <Sidebar tabs={sidebarTabs} activeTab="shopify" useRouter={true} />

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {!isIntegrated ? (
              <ShopifyIntegrationForm
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
              />
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">
                    Shopify Dashboard
                  </h1>
                  <button
                    onClick={handleDisconnect}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    Disconnect Store
                  </button>
                </div>
                <ShopifyDashboard
                  formData={formData}
                  onDisconnect={handleDisconnect}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopifyPage;
