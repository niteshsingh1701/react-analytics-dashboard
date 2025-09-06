import React from "react";
import { LogOut } from "lucide-react";

const NavigationBar = ({ 
  title = "Dashboard", 
  currentUser, 
  onLogout,
  rightContent 
}) => {
  return (
    <nav className="bg-white shadow-sm px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        <div className="flex items-center space-x-4">
          {rightContent || (
            <>
              <div className="flex items-center space-x-2">
                <img
                  src={currentUser?.photoURL}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-700">
                  {currentUser?.displayName}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
