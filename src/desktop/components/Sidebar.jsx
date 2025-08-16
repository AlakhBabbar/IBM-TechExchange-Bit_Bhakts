
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, MapPin, User, Plus, Bell, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        // Get saved state from localStorage, default to false
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved ? JSON.parse(saved) : false;
    });
    const location = useLocation();
    const { logout, user } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const toggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        // Save state to localStorage
        localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
    };

    // Check if current path is one of the home pages
    const isHomePage = ['/for-you', '/explore', '/trending', '/'].includes(location.pathname);

    const sidebarItems = [
        { to: "/for-you", label: "Home", icon: <Home size={20} />, isActive: isHomePage },
        { to: "/map", label: "Map", icon: <MapPin size={20} />, isActive: location.pathname === '/map' },
        { to: "/notifications", label: "Notifications", icon: <Bell size={20} />, isActive: location.pathname === '/notifications' },
        { to: "/profile", label: "Profile", icon: <User size={20} />, isActive: location.pathname === '/profile' },
        { to: "/create", label: "Create", icon: <Plus size={20} />, isActive: location.pathname === '/create' },
    ];

    return (
        <>
            {/* Hamburger Menu Button - Fixed Top Left */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-[60] p-3 bg-neutral-800 rounded-xl hover:bg-neutral-700 transition-all duration-200 shadow-lg hover:shadow-xl group focus:outline-none focus:ring-0 active:outline-none border-none"
                style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
                onFocus={(e) => e.target.blur()}
            >
                <div className="flex flex-col gap-1 pointer-events-none">
                    <div className="w-5 h-0.5 bg-white rounded-full transition-all duration-200 group-hover:w-6"></div>
                    <div className="w-5 h-0.5 bg-white rounded-full transition-all duration-200 group-hover:w-4"></div>
                    <div className="w-5 h-0.5 bg-white rounded-full transition-all duration-200 group-hover:w-6"></div>
                </div>
            </button>

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full bg-neutral-900/95 backdrop-blur-md text-white z-[55] transform transition-all duration-300 ease-in-out ${
                isCollapsed ? 'w-16' : 'w-64'
            } flex flex-col shadow-2xl border-r border-neutral-700`}>
                

                {/* Navigation Items */}
                <nav className={`flex-1 px-4 py-6 ${isCollapsed ? 'pt-16' : 'pt-16'}`}>
                    <ul className="space-y-2">
                        {sidebarItems.map((item) => (
                            <li key={item.to}>
                                <NavLink
                                    to={item.to}
                                    className={`flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 p-3'} rounded-lg hover:bg-neutral-800 transition-colors ${
                                        item.isActive ? 'bg-neutral-800 text-white' : 'text-gray-300'
                                    }`}
                                    title={isCollapsed ? item.label : ''}
                                >
                                    <span>{item.icon}</span>
                                    {!isCollapsed && <span className="text-base">{item.label}</span>}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Settings and Logout at Bottom */}
                <div className="p-4 border-t border-neutral-800 space-y-2">
                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className={`flex items-center ${isCollapsed ? 'justify-center p-3 w-full' : 'gap-3 p-3 w-full'} rounded-lg hover:bg-red-600/20 text-red-400 hover:text-red-300 transition-colors`}
                        title={isCollapsed ? 'Logout' : ''}
                    >
                        <span><LogOut size={20} /></span>
                        {!isCollapsed && <span className="text-base">Logout</span>}
                    </button>

                    {/* User Info */}
                    {!isCollapsed && user && (
                        <div className="pt-2 border-t border-neutral-800 mt-2">
                            <div className="text-xs text-gray-400 truncate">
                                {user.email}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Sidebar;