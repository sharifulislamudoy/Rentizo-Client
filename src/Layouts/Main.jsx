import { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import { Outlet, useLocation } from 'react-router';
import Footer from '../Components/Footer';
import { ToastContainer } from 'react-toastify';
import LoadingSpinner from '../Utils/LoadingSpinner';

const Main = () => {
    // useLocation hook gives access to the current URL/location object
    const location = useLocation();

    // State to control loading spinner visibility
    const [loading, setLoading] = useState(false);

    // Run effect whenever the URL path changes
    useEffect(() => {
        setLoading(true); // Show loading spinner when location changes

        // Hide loading spinner after 1 second
        const timeout = setTimeout(() => setLoading(false), 1000);

        // Cleanup timeout if component unmounts or location changes quickly
        return () => clearTimeout(timeout);
    }, [location.pathname]);

    // Show loading spinner while loading is true
    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div>
            {/* Navbar shown on every page */}
            <Navbar />

            {/* Outlet renders the matched child route component */}
            <Outlet />

            {/* Footer shown on every page */}
            <Footer />

            {/* Container for showing toast notifications */}
            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
};

export default Main;
