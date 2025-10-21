import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthProvider';
import { Navigate, useLocation } from 'react-router';
import axios from 'axios';

const CarOwnerRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const [userRole, setUserRole] = useState(null);
    const [checkingRole, setCheckingRole] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const fetchUserRole = async () => {
            if (user?.email) {
                try {
                    const response = await axios.get(`http://localhost:3000/users/${user.email}`);
                    setUserRole(response.data.role);
                } catch (error) {
                    console.error('Error fetching user role:', error);
                    setUserRole('user');
                }
            }
            setCheckingRole(false);
        };

        if (user) {
            fetchUserRole();
        } else {
            setCheckingRole(false);
        }
    }, [user]);

    if (loading || checkingRole) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (userRole !== 'car-owner') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default CarOwnerRoute;