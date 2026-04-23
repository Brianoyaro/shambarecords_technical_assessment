import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { FieldDetailsPage } from './pages/FieldDetailsPage';
import { FieldCreatePage } from './pages/FieldCreatePage';
import { FieldEditPage } from './pages/FieldEditPage';
import { FieldUpdatePage } from './pages/FieldUpdatePage';
import { EditFieldUpdatePage } from './pages/EditFieldUpdatePage';
import { UsersPage } from './pages/UsersPage';

function App() {
  const { initializeAuth } = useAuthStore();

  // Initialize auth from localStorage on app load
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes wrapped with Layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/fields/create"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <FieldCreatePage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/fields/:fieldId/edit"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <FieldEditPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/fields/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <FieldDetailsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/fields/:fieldId/add-update"
          element={
            <ProtectedRoute>
              <Layout>
                <FieldUpdatePage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/fields/:fieldId/updates/:updateId/edit"
          element={
            <ProtectedRoute>
              <Layout>
                <EditFieldUpdatePage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <UsersPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
