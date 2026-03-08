import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import MainLayout from './layout/MainLayout';
import Locations from './pages/Locations';
import Transportations from './pages/Transportations';
import RoutesPage from './pages/RoutesPage';
import './App.css';
import client from './api/client';
import Modal from './components/Modal';

const ProtectedRoute = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const AppContent = () => {
  const [forbiddenModalOpen, setForbiddenModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = client.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        if (error.response) {
          const isLoginRequest = error.config?.url?.includes('/auth/login');

          if (error.response.status === 401 && !isLoginRequest) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
          } else if (error.response.status === 403) {
            setForbiddenModalOpen(true);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      client.interceptors.response.eject(interceptor);
    };
  }, []);

  const handleCloseForbidden = () => {
    setForbiddenModalOpen(false);
    navigate('/routes');
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<ProtectedRoute />}>
          {/* Ana Uygulama Yapısı */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/routes" replace />} />
            <Route path="locations" element={<Locations />} />
            <Route path="transportations" element={<Transportations />} />
            <Route path="routes" element={<RoutesPage />} />
          </Route>
        </Route>
      </Routes>

      <Modal 
        isOpen={forbiddenModalOpen}
        title="Access Denied"
        message="Yetkiniz bulunmamaktadir, sistem yoneticinizle gorusun."
        type="error"
        onClose={handleCloseForbidden}
      />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;