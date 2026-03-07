import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import MainLayout from './layout/MainLayout';
import Locations from './pages/Locations';
import Transportations from './pages/Transportations';
import RoutesPage from './pages/RoutesPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Ana Uygulama Yapısı */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/routes" replace />} />
          <Route path="locations" element={<Locations />} />
          <Route path="transportations" element={<Transportations />} />
          <Route path="routes" element={<RoutesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;