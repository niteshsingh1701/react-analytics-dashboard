import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./components/auth/LoginPage";
import UploadPage from "./pages/UploadPage";
import DashboardPage from "./pages/DashboardPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ChatBotPage from "./pages/ChatBotPage";
import ProfitPage from "./pages/ProfitPage";
import AmazonPage from "./pages/AmazonPage";
import ShopifyPage from "./pages/ShopifyPage";
import "./App.css";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <UploadPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProtectedRoute>
                  <ProductDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chatbot"
              element={
                <ProtectedRoute>
                  <ChatBotPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profit"
              element={
                <ProtectedRoute>
                  <ProfitPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/amazon"
              element={
                <ProtectedRoute>
                  <AmazonPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shopify"
              element={
                <ProtectedRoute>
                  <ShopifyPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
    </Provider>
  );
}

export default App;
