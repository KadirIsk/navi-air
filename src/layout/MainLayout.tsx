import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import '../App.css';

const MainLayout: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username, setUsername] = useState('User');
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.sub) {
          setUsername(payload.sub);
        }
        const extractedRoles = payload.roles || (payload.role ? [payload.role] : []) || (payload.authorities ? payload.authorities : []);
        const rolesArrayRaw = Array.isArray(extractedRoles) ? extractedRoles : [extractedRoles];
        const rolesArray = rolesArrayRaw.map((r: any) => String(r).replace(/^ROLE_/, ''));
        setUserRoles(rolesArray);
      } catch (e) {
        console.error("Failed to parse token", e);
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  const hasRole = (roles: string[]) => roles.some(role => userRoles.includes(role));

  return (
    <div className="app-container">
      <header className="app-header">
        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', fontFamily: "'Syne', sans-serif", letterSpacing: '-1px' }}>
          NAVI<span style={{ color: '#2196F3' }}>AIR</span>
        </div>
        
        <div className="user-menu" ref={dropdownRef} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2196F3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
            {username.charAt(0).toUpperCase()}
          </div>
          <span>{username}</span>
          <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
          
          {isDropdownOpen && (
            <div className="user-menu-dropdown">
              <button onClick={handleLogout} className="user-menu-item">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      
      <div className="app-body">
        <aside className="app-sidebar">
          <ul>
            {hasRole(['ADMIN', 'AGENCY']) && (
              <li>
                <Link to="/routes" style={{ backgroundColor: isActive('/routes') ? 'rgba(255, 255, 255, 0.15)' : 'transparent', color: isActive('/routes') ? '#fff' : 'rgba(255, 255, 255, 0.8)' }}>
                  Routes
                </Link>
              </li>
            )}
            {hasRole(['ADMIN']) && (
              <li>
                <Link to="/locations" style={{ backgroundColor: isActive('/locations') ? 'rgba(255, 255, 255, 0.15)' : 'transparent', color: isActive('/locations') ? '#fff' : 'rgba(255, 255, 255, 0.8)' }}>
                  Locations
                </Link>
              </li>
            )}
            {hasRole(['ADMIN']) && (
              <li>
                <Link to="/transportations" style={{ backgroundColor: isActive('/transportations') ? 'rgba(255, 255, 255, 0.15)' : 'transparent', color: isActive('/transportations') ? '#fff' : 'rgba(255, 255, 255, 0.8)' }}>
                  Transportations
                </Link>
              </li>
            )}
          </ul>
        </aside>
        
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
