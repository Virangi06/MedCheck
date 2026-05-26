import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import { useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SymptomChecker from './pages/SymptomChecker';
import Results from './pages/Results';
import PatientDashboard from './pages/PatientDashboard';
import AboutUs from './pages/AboutUs';

function App() {
  const { user, loading, logout } = useAuth();

  const location = useLocation();

  // Hide Navbar on Login & Register pages
  const hideNavbar =
    location.pathname === '/login' ||
    location.pathname === '/register';

  // ─────────────────────────────────────────
  // Protected Route Component
  // ─────────────────────────────────────────
  const ProtectedRoute = ({
    children,
    requiredRole = null,
  }) => {
    if (loading) {
      return (
        <div
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            fontFamily:
              "'DM Sans', sans-serif",
            color: '#0f172a',
            fontSize: '18px',
            fontWeight: '600',
          }}
        >
          Loading...
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (
      requiredRole &&
      user.role !== requiredRole
    ) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <>
      {/* Navbar Hidden on Login/Register */}
      {!hideNavbar && (
        <Navbar
          user={user}
          onLogout={logout}
        />
      )}

      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/about"
          element={<AboutUs />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected Patient Routes */}
        <Route
          path="/symptom-checker"
          element={
            <ProtectedRoute requiredRole="patient">
              <SymptomChecker />
            </ProtectedRoute>
          }
        />

        <Route
          path="/results"
          element={
            <ProtectedRoute requiredRole="patient">
              <Results />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute requiredRole="patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback Route */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </>
  );
}

export default App;