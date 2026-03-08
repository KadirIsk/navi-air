import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import MainLayout from './layout/MainLayout';
import Locations from './pages/Locations';
import Transportations from './pages/Transportations';
import RoutesPage from './pages/RoutesPage';
import './App.css';

const ProtectedRoute = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;