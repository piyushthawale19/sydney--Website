import React, { useState } from 'react';
import { interestAPI } from '../services/api';

const EventCard = ({ event }) => {
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('');
    const [consent, setConsent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-AU', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleGetTickets = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await interestAPI.record({
                email,
                eventId: event._id,
                consent
            });

            setSuccess(true);

            // Redirect to original URL after 1.5 seconds
            setTimeout(() => {
                window.open(event.originalUrl, '_blank');
                setShowModal(false);
                setSuccess(false);
                setEmail('');
                setConsent(false);
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to process request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="card overflow-hidden group animate-fade-in">
                {/* Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {event.imageUrl ? (
                        <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                            <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                    {/* Source Badge */}
                    <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm">
                            {event.sourceSite}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                        {event.title}
                    </h3>

                    {/* Date & Time */}
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                        <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <time>{formatDate(event.dateTime)}</time>
                    </div>

                    {/* Venue */}
                    <div className="flex items-start text-sm text-gray-600 mb-3">
                        <svg className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="line-clamp-2">{event.venue}</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {event.shortDescription || event.description}
                    </p>

                    {/* CTA Button */}
                    <button
                        onClick={() => setShowModal(true)}
                        className="w-full btn-primary"
                    >
                        GET TICKETS
                    </button>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
                        {/* Close button */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {success ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
                                <p className="text-gray-600">Redirecting to event page...</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Get Tickets
                                </h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    {event.title}
                                </p>

                                <form onSubmit={handleGetTickets}>
                                    <div className="mb-4">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="input"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <label className="flex items-start">
                                            <input
                                                type="checkbox"
                                                checked={consent}
                                                onChange={(e) => setConsent(e.target.checked)}
                                                className="mt-1 mr-2 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                            />
                                            <span className="text-sm text-gray-600">
                                                I would like to receive updates about similar events
                                            </span>
                                        </label>
                                    </div>

                                    {error && (
                                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="w-full btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : 'Continue to Event Page'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default EventCard;
