import Banner from '../Components/Banner';
import LuxuryExperienceSection from '../Components/LuxuryExperienceSection';
import RecentListings from '../Components/RecentListings';
import SpecialOffers from '../Components/SpecialOffers';
import StatsSection from '../Components/StatsSection';
import WhyChooseUs from '../Components/WhyChooseUs';
import useScrollToTop from '../Utils/UseScrollToTop';

const Home = () => {
  useScrollToTop(); // Scroll to top when this page loads

  return (
    <div>
      {/* Main sections of the homepage */}
      <Banner />
      <WhyChooseUs />
      <RecentListings />
      <LuxuryExperienceSection />
      <SpecialOffers />
      <StatsSection />
    </div>
  );
};

export default Home;
