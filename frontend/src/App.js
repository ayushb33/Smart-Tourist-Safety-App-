import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Common Components
import Navbar from './components/common/Navbar';

// Tourist Components
import Login from './components/tourist/Login.js';
import Register from './components/tourist/Register.js';
import TouristHome from './components/tourist/Home.js';
import TouristMap from './components/tourist/Map.js';
import QRDisplay from './components/tourist/QRCode.js';
import SOS from './components/tourist/SOS.js';
import SafetyCheck from './components/tourist/SafetyCheck.js';

// Police Components  
import PoliceDashboard from './components/police/Dashboard.js';
import TouristList from './components/police/TouristList.js';
import Heatmap from './components/police/HeatMap.js';
import AlertPanel from './components/police/AlertPanel.js';

// Services
import { authService } from './services/auth';

// Simple route protection without complex state
const ProtectedRoute = ({ children, requiredUserType }) => {
  const isAuth = authService.isAuthenticated();
  const userType = authService.getUserType();
  
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredUserType && userType !== requiredUserType) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Simple default route
const DefaultRoute = () => {
  const isAuth = authService.isAuthenticated();
  const userType = authService.getUserType();
  
  if (isAuth && userType === 'tourist') {
    return <Navigate to="/tourist/home" replace />;
  }
  
  if (isAuth && userType === 'police') {
    return <Navigate to="/police/dashboard" replace />;
  }
  
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Tourist Routes */}
            <Route 
              path="/tourist/home" 
              element={
                <ProtectedRoute requiredUserType="tourist">
                  <TouristHome />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tourist/map" 
              element={
                <ProtectedRoute requiredUserType="tourist">
                  <TouristMap />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tourist/qr" 
              element={
                <ProtectedRoute requiredUserType="tourist">
                  <QRDisplay />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tourist/sos" 
              element={
                <ProtectedRoute requiredUserType="tourist">
                  <SOS />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tourist/safety-check" 
              element={
                <ProtectedRoute requiredUserType="tourist">
                  <SafetyCheck />
                </ProtectedRoute>
              } 
            />
            
            {/* Police Routes */}
            <Route 
              path="/police/dashboard" 
              element={
                <ProtectedRoute requiredUserType="police">
                  <PoliceDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/police/tourists" 
              element={
                <ProtectedRoute requiredUserType="police">
                  <TouristList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/police/heatmap" 
              element={
                <ProtectedRoute requiredUserType="police">
                  <Heatmap />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/police/alerts" 
              element={
                <ProtectedRoute requiredUserType="police">
                  <AlertPanel />
                </ProtectedRoute>
              } 
            />
            
            {/* Default Route */}
            <Route path="/" element={<DefaultRoute />} />
            
            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        
        <ToastContainer 
          position="top-right" 
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;
