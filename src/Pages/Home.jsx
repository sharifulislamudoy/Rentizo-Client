import { ReTitle } from 're-title';
import Banner from '../Components/Banner';
import LuxuryExperienceSection from '../Components/LuxuryExperienceSection';
import RecentListings from '../Components/RecentListings';
import SpecialOffers from '../Components/SpecialOffers';
import StatsSection from '../Components/StatsSection';
import useScrollToTop from '../Utils/UseScrollToTop';
import PopularDestinations from '../Components/PopularDestinations';

const Home = () => {
  useScrollToTop(); // Scroll to top when this page loads

  return (
    <div>
      <ReTitle title='Retizo | Home' />
      <Banner />
      <PopularDestinations />
      <RecentListings />
      <LuxuryExperienceSection />
      <SpecialOffers />
      <StatsSection />
    </div>
  );
};

export default Home;
