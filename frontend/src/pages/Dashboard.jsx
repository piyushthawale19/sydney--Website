import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [importNotes, setImportNotes] = useState('');
    const [importLoading, setImportLoading] = useState(false);

    const [filters, setFilters] = useState({
        keyword: '',
        city: 'Sydney',
        startDate: '',
        endDate: '',
        status: ''
    });

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, authLoading, navigate]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchDashboardData();
        }
    }, [isAuthenticated, filters]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch events
            const params = { ...filters, limit: 100 };
            Object.keys(params).forEach(key => {
                if (!params[key]) delete params[key];
            });

            const eventsResponse = await eventsAPI.getAll(params);
            setEvents(eventsResponse.data.data);

            // Fetch stats
            const statsResponse = await eventsAPI.getStats();
            setStats(statsResponse.data.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (eventId) => {
        setImportLoading(true);
        try {
            await eventsAPI.import(eventId, importNotes);
            setImportNotes('');
            setSelectedEvent(null);
            fetchDashboardData(); // Refresh data
        } catch (error) {
            console.error('Error importing event:', error);
            alert('Failed to import event');
        } finally {
            setImportLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-AU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const badges = status.map(s => {
            switch (s) {
                case 'new':
                    return <span key={s} className="badge-new">NEW</span>;
                case 'updated':
                    return <span key={s} className="badge-updated">UPDATED</span>;
                case 'inactive':
                    return <span key={s} className="badge-inactive">INACTIVE</span>;
                case 'imported':
                    return <span key={s} className="badge-imported">IMPORTED</span>;
                default:
                    return null;
            }
        });
        return <div className="flex gap-1">{badges}</div>;
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <LoadingSpinner text="Loading dashboard..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Stats */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
                        </div>
                        <button
                            onClick={fetchDashboardData}
                            className="btn-secondary"
                        >
                            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </button>
                    </div>

                    {/* Stats Cards */}
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow">
                                <div className="text-3xl font-bold">{stats.total}</div>
                                <div className="text-blue-100 text-sm">Total Events</div>
                            </div>
                            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow">
                                <div className="text-3xl font-bold">{stats.newCount}</div>
                                <div className="text-green-100 text-sm">New Events</div>
                            </div>
                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow">
                                <div className="text-3xl font-bold">{stats.updatedCount}</div>
                                <div className="text-orange-100 text-sm">Updated</div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow">
                                <div className="text-3xl font-bold">{stats.importedCount}</div>
                                <div className="text-purple-100 text-sm">Imported</div>
                            </div>
                            <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white p-6 rounded-lg shadow">
                                <div className="text-3xl font-bold">{stats.upcoming}</div>
                                <div className="text-primary-100 text-sm">Upcoming</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <input
                            type="text"
                            placeholder="Search keyword..."
                            value={filters.keyword}
                            onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                            className="input"
                        />

                        <select
                            value={filters.city}
                            onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                            className="input"
                        >
                            <option value="">All Cities</option>
                            <option value="Sydney">Sydney</option>
                            <option value="Melbourne">Melbourne</option>
                        </select>

                        <input
                            type="date"
                            placeholder="Start Date"
                            value={filters.startDate}
                            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                            className="input"
                        />

                        <input
                            type="date"
                            placeholder="End Date"
                            value={filters.endDate}
                            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                            className="input"
                        />

                        <select
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            className="input"
                        >
                            <option value="">All Status</option>
                            <option value="new">New</option>
                            <option value="updated">Updated</option>
                            <option value="imported">Imported</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <button
                        onClick={() => setFilters({ keyword: '', city: 'Sydney', startDate: '', endDate: '', status: '' })}
                        className="mt-4 text-sm text-primary hover:text-primary-700 font-medium"
                    >
                        Clear All Filters
                    </button>
                </div>
            </div>

            {/* Events Table */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-6">
                    {/* Table */}
                    <div className={`${selectedEvent ? 'lg:w-2/3' : 'w-full'} transition-all duration-300`}>
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Title
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Venue
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Source
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {events.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                    No events found matching your filters
                                                </td>
                                            </tr>
                                        ) : (
                                            events.map(event => (
                                                <tr
                                                    key={event._id}
                                                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${selectedEvent?._id === event._id ? 'bg-primary-50' : ''
                                                        }`}
                                                    onClick={() => setSelectedEvent(event)}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                                            {event.title}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {formatDate(event.dateTime)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        <div className="line-clamp-1">{event.venue}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(event.status)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {event.sourceSite}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {!event.imported && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedEvent(event);
                                                                }}
                                                                className="text-primary hover:text-primary-700 font-medium"
                                                            >
                                                                Import
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Preview Sidebar */}
                    {selectedEvent && (
                        <div className="hidden lg:block lg:w-1/3">
                            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Event Preview</h3>
                                    <button
                                        onClick={() => setSelectedEvent(null)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {selectedEvent.imageUrl && (
                                    <img
                                        src={selectedEvent.imageUrl}
                                        alt={selectedEvent.title}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                )}

                                <h4 className="font-semibold text-gray-900 mb-2">{selectedEvent.title}</h4>

                                <div className="space-y-3 mb-4 text-sm">
                                    <div className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-gray-700">{formatDate(selectedEvent.dateTime)}</span>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="text-gray-700">{selectedEvent.venue}</span>
                                    </div>

                                    {selectedEvent.category && (
                                        <div className="flex items-start gap-2">
                                            <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                            <span className="text-gray-700">{selectedEvent.category}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <h5 className="font-medium text-gray-900 mb-2">Description</h5>
                                    <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                                </div>

                                <div className="mb-4">
                                    {getStatusBadge(selectedEvent.status)}
                                </div>

                                <a
                                    href={selectedEvent.originalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center btn-secondary mb-4"
                                >
                                    View Original
                                </a>

                                {!selectedEvent.imported && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Import Notes (Optional)
                                        </label>
                                        <textarea
                                            value={importNotes}
                                            onChange={(e) => setImportNotes(e.target.value)}
                                            className="input mb-3"
                                            rows="3"
                                            placeholder="Add any notes about this import..."
                                        />
                                        <button
                                            onClick={() => handleImport(selectedEvent._id)}
                                            disabled={importLoading}
                                            className="w-full btn-primary"
                                        >
                                            {importLoading ? 'Importing...' : 'Import to Platform'}
                                        </button>
                                    </div>
                                )}

                                {selectedEvent.imported && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 text-green-700 mb-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="font-medium">Already Imported</span>
                                        </div>
                                        {selectedEvent.importedBy && (
                                            <p className="text-sm text-green-600">By: {selectedEvent.importedBy}</p>
                                        )}
                                        {selectedEvent.importedAt && (
                                            <p className="text-sm text-green-600">
                                                On: {formatDate(selectedEvent.importedAt)}
                                            </p>
                                        )}
                                        {selectedEvent.importNotes && (
                                            <p className="text-sm text-green-600 mt-2">
                                                <strong>Notes:</strong> {selectedEvent.importNotes}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
