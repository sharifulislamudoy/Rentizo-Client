import { useLocation } from 'react-router';
import Banner from '../Components/Banner';
import LuxuryExperienceSection from '../Components/LuxuryExperienceSection';
import SpecialOffers from '../Components/SpecialOffers';
import WhyChooseUs from '../Components/WhyChooseUs';
import LoadingSpinner from '../Utils/LoadingSpinner';
import useScrollToTop from '../Utils/UseScrollToTop';
import { useEffect, useState } from 'react';

const Home = () => {
    useScrollToTop();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timeout);
    }, [location.pathname]);

    if (loading) {
        return <LoadingSpinner></LoadingSpinner>;
    }
    return (
        <div>
            <Banner />
            <WhyChooseUs />
            <LuxuryExperienceSection />
            <SpecialOffers />
        </div>
    );
};

export default Home;