import Banner from '../Components/Banner';
import LuxuryExperienceSection from '../Components/LuxuryExperienceSection';
import RecentListings from '../Components/RecentListings';
import SpecialOffers from '../Components/SpecialOffers';
import WhyChooseUs from '../Components/WhyChooseUs';
import useScrollToTop from '../Utils/UseScrollToTop';

const Home = () => {
    useScrollToTop();
    return (
        <div>
            <Banner />
            <WhyChooseUs />
            <RecentListings />
            <LuxuryExperienceSection />
            <SpecialOffers />
        </div>
    );
};

export default Home;