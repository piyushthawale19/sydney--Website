import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        handleCallback();
    }, []);

    const handleCallback = async () => {
        const token = searchParams.get('token');

        if (!token) {
            navigate('/login?error=no_token');
            return;
        }

        try {
            await login(token);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            navigate('/login?error=login_failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <LoadingSpinner size="xl" text="Completing login..." />
            </div>
        </div>
    );
};

export default AuthCallback;
