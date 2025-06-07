import { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import { Outlet, useLocation } from 'react-router';
import Footer from '../Components/Footer';
import { ToastContainer } from 'react-toastify';
import LoadingSpinner from '../Utils/LoadingSpinner';

const Main = () => {
    const location = useLocation;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timeout);
    }, [location.pathname]);

    if (loading) {
        return <LoadingSpinner />;
    }
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
            <ToastContainer />
        </div>
    );
};

export default Main;