import Banner from '../Components/Banner';
import WhyChooseUs from '../Components/WhyChooseUs';
import useScrollToTop from '../Utils/UseScrollToTop';

const Home = () => {
    useScrollToTop();
    return (
        <div>
            <Banner></Banner>
            <WhyChooseUs></WhyChooseUs>
        </div>
    );
};

export default Home;