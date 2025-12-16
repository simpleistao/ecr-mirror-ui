import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Settings, Layers, Box } from 'lucide-react';

const Layout: React.FC = () => {
    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className="sidebar glass-panel">
                <div className="sidebar-header">
                    <div className="logo-icon">
                        <Box size={24} />
                    </div>
                    <h1 className="logo-text">
                        ECR Mirror
                    </h1>
                </div>

                <nav className="nav-menu">
                    <NavLink
                        to="/"
                        className={({ isActive }: { isActive: boolean }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <LayoutDashboard size={20} />
                        <span>Request Mirror</span>
                    </NavLink>

                    <NavLink
                        to="/config"
                        className={({ isActive }: { isActive: boolean }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <Settings size={20} />
                        <span>Configuration</span>
                    </NavLink>

                    <NavLink
                        to="/ecr"
                        className={({ isActive }: { isActive: boolean }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <Layers size={20} />
                        <span>ECR Explorer</span>
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    v1.0.0 • Connected to Prod
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <div className="content-wrapper">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
