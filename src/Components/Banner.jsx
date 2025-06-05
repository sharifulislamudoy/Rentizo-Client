import { Link } from 'react-router';
import { motion } from 'framer-motion';
import BannerImg from '../assets/banner.png'

const Banner = () => {
    return (
        <div
            className="relative w-full min-h-screen bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${BannerImg})` }}
        >
            {/* Overlay */}
            <div class="absolute inset-0 bg-black opacity-70"></div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: false }}
                className="relative text-center text-white z-10 px-4"
            >
                <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                    Drive Your Dreams Today!
                </h1>
                <p className="text-lg md:text-xl mb-4 font-poppins">
                    Welcome to Rentizo – your trusted platform for finding and renting top-quality vehicles at unbeatable prices.
                </p>
                <Link to="/available-cars">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-primary text-lg px-6 py-3 shadow-lg"
                    >
                        View Available Cars
                    </motion.button>
                </Link>
            </motion.div>
        </div>
    );
};

export default Banner;
