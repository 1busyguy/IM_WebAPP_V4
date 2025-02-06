import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { AuthGuard } from './components/AuthGuard';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { PartnerList } from './components/partners/PartnerList';
import { UserList } from './components/users/UserList';
import { CollectionList } from './components/collections/CollectionList';
import { ActivationList } from './components/activations/ActivationList';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Auth routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/" element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }>
            <Route index element={<PartnerList />} />
            <Route path="partners/:partnerId" element={<UserList />} />
            <Route path="users/:userId/collections" element={<CollectionList />} />
            <Route path="users/:userId/activations" element={<ActivationList />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;