import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({
  tabs = [],
  activeTab,
  onTabChange,
  className = "",
  width = "w-64",
  useRouter = false,
}) => {
  const navigate = useNavigate();

  const handleClick = (tab) => {
    if (useRouter) {
      // Navigate to route based on tab id
      navigate(`/${tab.id}`);
    } else if (onTabChange) {
      // Local tab switching
      onTabChange(tab.id);
    }
  };
  return (
    <div className={`${width} bg-white shadow-lg min-h-screen ${className}`}>
      <nav className="mt-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleClick(tab)}
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
  );
};

export default Sidebar;
