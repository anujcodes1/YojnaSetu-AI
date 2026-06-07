import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Layout from './components/layout/Layout';
import Navbar from './components/layout/Navbar';

import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Schemes from './pages/schemes/Schemes';
import SchemeDetail from './pages/schemes/SchemeDetail';
import Recommendations from './pages/dashboard/Recommendations';
import Profile from './pages/dashboard/Profile';
import SavedSchemes from './pages/dashboard/SavedSchemes';
import EligibilityCheck from './pages/dashboard/EligibilityCheck';
import Chat from './pages/dashboard/Chat';
import AdminPanel from './pages/admin/AdminPanel';
import NotFound from './pages/NotFound';
import ApplicationTracker from './pages/dashboard/ApplicationTracker';

const ProtectedRoute = ({ children, adminRequired = false }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-saffron-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm">Loading YojnaSetu...</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (adminRequired && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public pages - with top Navbar */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/schemes" element={<Schemes />} />
        <Route path="/schemes/:id" element={<SchemeDetail />} />

        {/* Protected pages - with sidebar Layout */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="profile" element={<Profile />} />
          <Route path="saved" element={<SavedSchemes />} />
          <Route path="eligibility" element={<EligibilityCheck />} />
          <Route path="chat" element={<Chat />} />
          <Route path="tracker"         element={<ApplicationTracker />} />
        </Route>

        {/* Admin */}
        <Route path="/admin/*" element={<ProtectedRoute adminRequired><AdminPanel /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: '12px', fontSize: '14px' },
            success: { iconTheme: { primary: '#FF6B35', secondary: '#fff' } }
          }}
        />
      </Router>
    </AuthProvider>
  );
}