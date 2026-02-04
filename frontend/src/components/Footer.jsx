import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">SE</span>
                            </div>
                            <span className="text-lg font-bold text-gray-900">Sydney Events</span>
                        </div>
                        <p className="text-sm text-gray-600">
                            Your go-to platform for discovering amazing events in Sydney, Australia.
                        </p>
                    </div>

                    {/* Events */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Events</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="/" className="hover:text-primary transition-colors">All Events</a></li>
                            <li><a href="/?category=Music" className="hover:text-primary transition-colors">Music</a></li>
                            <li><a href="/?category=Arts" className="hover:text-primary transition-colors">Arts & Culture</a></li>
                            <li><a href="/?category=Sports" className="hover:text-primary transition-colors">Sports</a></li>
                        </ul>
                    </div>

                    {/* About */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">About</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>

                    {/* Sources */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Event Sources</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>Eventbrite</li>
                            <li>Sydney.com</li>
                            <li>What's On Sydney</li>
                            <li>City of Sydney</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 mt-8 pt-8">
                    <p className="text-center text-sm text-gray-500">
                        © {currentYear} Sydney Events Platform. All rights reserved. | Built with MERN Stack
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
