import { ReTitle } from 're-title';
import Banner from '../Components/Banner';
import RecentListings from '../Components/RecentListings';
import useScrollToTop from '../Utils/UseScrollToTop';
import PopularDestinations from '../Components/PopularDestinations';
import HowItWorks from '../Components/HowItWorks';
import LatestDeals from '../Components/LatestDeals';
import StatsAchievements from '../Components/StatsAchievements';
import PartnerBrands from '../Components/PartnerBrands';
import NewsletterSignup from '../Components/NewsletterSignup';
import Chatbot from '../Components/Chatbot';

const Home = () => {
  useScrollToTop(); // Scroll to top when this page loads

  return (
    <div>
      <ReTitle title='Retizo' />
      <Banner />
      <Chatbot />
      <PopularDestinations />
      <RecentListings />
      <HowItWorks />
      {/* <LatestDeals /> */}
      <StatsAchievements />
      <PartnerBrands />
      <NewsletterSignup />
    </div>
  );
};

export default Home;
