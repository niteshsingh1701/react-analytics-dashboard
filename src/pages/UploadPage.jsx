import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import FileUpload from "../components/upload/FileUpload";
import NavigationBar from "../components/common/NavigationBar";

const UploadPage = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar 
        title="Skin"
        currentUser={currentUser}
        onLogout={handleLogout}
        rightContent={
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img
                src={currentUser?.photoURL}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-gray-700">
                Welcome, {currentUser?.displayName}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        }
      />

      <div className="container mx-auto px-6 py-8">
        <FileUpload />
      </div>
    </div>
  );
};

export default UploadPage;
