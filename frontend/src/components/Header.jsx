import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();

    const handleLogout = async () => {
        await logout();
        window.location.href = '/';
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">SE</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Sydney Events</h1>
                            <p className="text-xs text-gray-500">Discover What's On</p>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center space-x-6">
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-primary font-medium transition-colors"
                        >
                            Events
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="text-gray-700 hover:text-primary font-medium transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <div className="flex items-center space-x-3">
                                    {user?.picture && (
                                        <img
                                            src={user.picture}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full border-2 border-primary"
                                        />
                                    )}
                                    <span className="text-sm text-gray-700">{user?.name}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm text-gray-600 hover:text-primary transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <a
                                href={`${import.meta.env.VITE_API_URL}/auth/google`}
                                className="btn-primary"
                            >
                                Admin Login
                            </a>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
