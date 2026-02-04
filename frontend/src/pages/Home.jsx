import React, { useState, useEffect } from 'react';
import { eventsAPI } from '../services/api';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        keyword: '',
        category: '',
        city: 'Sydney'
    });

    useEffect(() => {
        fetchEvents();
    }, [page, filters]);

    const fetchEvents = async () => {
        setLoading(true);
        setError('');

        try {
            const params = {
                page,
                limit: 12,
                ...filters
            };

            // Remove empty filters
            Object.keys(params).forEach(key => {
                if (!params[key]) delete params[key];
            });

            const response = await eventsAPI.getAll(params);
            setEvents(response.data.data);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError('Failed to load events. Please try again later.');
            console.error('Error fetching events:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchEvents();
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Discover Amazing Events in Sydney
                        </h1>
                        <p className="text-xl text-primary-100 mb-8">
                            From concerts to festivals, find your next adventure
                        </p>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={filters.keyword}
                                    onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                                    placeholder="Search events, venues, or categories..."
                                    className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                                />
                                <button type="submit" className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-primary-50 transition-colors">
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* Filter Section */}
            <section className="bg-gray-50 border-b border-gray-200 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">Category:</label>
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">All Categories</option>
                                <option value="Music">Music</option>
                                <option value="Arts">Arts & Culture</option>
                                <option value="Sports">Sports</option>
                                <option value="Food">Food & Drink</option>
                                <option value="Business">Business</option>
                                <option value="General">General</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">City:</label>
                            <select
                                value={filters.city}
                                onChange={(e) => handleFilterChange('city', e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="Sydney">Sydney</option>
                                <option value="Melbourne">Melbourne (Coming Soon)</option>
                            </select>
                        </div>

                        <button
                            onClick={() => {
                                setFilters({ keyword: '', category: '', city: 'Sydney' });
                                setPage(1);
                            }}
                            className="ml-auto text-sm text-primary hover:text-primary-700 font-medium"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </section>

            {/* Events Grid */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <LoadingSpinner />
                    ) : error ? (
                        <div className="text-center py-12">
                            <div className="text-red-600 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <p className="text-gray-600">{error}</p>
                            <button
                                onClick={fetchEvents}
                                className="mt-4 btn-primary"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <p className="text-gray-600 text-lg">No events found</p>
                            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search query</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {events.map(event => (
                                    <EventCard key={event._id} event={event} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-12 flex justify-center items-center gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                    >
                                        Previous
                                    </button>

                                    <div className="flex gap-1">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => setPage(i + 1)}
                                                className={`w-10 h-10 rounded-lg font-medium transition-colors ${page === i + 1
                                                        ? 'bg-primary text-white'
                                                        : 'border border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
