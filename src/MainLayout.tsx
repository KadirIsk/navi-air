import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-logo">Navi Air</div>
        <div className="header-user">User Info</div>
      </header>

      <div className="app-body">
        {/* Sidebar */}
        <aside className="app-sidebar">
          <nav>
            <ul>
              <li><Link to="/locations">Locations</Link></li>
              <li><Link to="/transportations">Transportations</Link></li>
              <li><Link to="/routes">Routes</Link></li>
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;