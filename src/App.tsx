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
import { useTranslation } from 'react-i18next';

const PrivateRoute = ({ roles }: { roles: string[] }) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Rolleri güvenli bir şekilde diziye çevir (roles, role veya authorities alanlarını kontrol et)
    const extractedRoles = payload.roles || (payload.role ? [payload.role] : []) || (payload.authorities ? payload.authorities : []);
    const rawUserRoles = Array.isArray(extractedRoles) ? extractedRoles : [extractedRoles];
    const userRoles = rawUserRoles.map((r: any) => String(r).replace(/^ROLE_/, ''));
    const hasRole = roles.some(role => userRoles.includes(role));

    if (!hasRole) {
      if (userRoles.some((r: string) => ['ADMIN', 'AGENCY'].includes(r))) {
         return <Navigate to="/routes" replace />;
      }
      console.warn("User has no valid roles:", userRoles);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return <Navigate to="/login" replace />;
    }
  } catch (e) {
    console.error("Token decode error", e);
    localStorage.removeItem('accessToken');
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const AppContent = () => {
  const [forbiddenModalOpen, setForbiddenModalOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

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
        
        {/* Ana Uygulama Yapısı */}
        <Route element={<PrivateRoute roles={['ADMIN', 'AGENCY']} />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/routes" replace />} />
            
            <Route element={<PrivateRoute roles={['ADMIN']} />}>
              <Route path="locations" element={<Locations />} />
              <Route path="transportations" element={<Transportations />} />
            </Route>

            <Route element={<PrivateRoute roles={['ADMIN', 'AGENCY']} />}>
              <Route path="routes" element={<RoutesPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>

      <Modal 
        isOpen={forbiddenModalOpen}
        title={t('errors.access_denied')}
        message={t('errors.access_denied_msg')}
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