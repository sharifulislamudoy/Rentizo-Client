import { Link } from 'react-router'; // Link component for navigation
import { motion } from 'framer-motion'; // Animation library
import BannerImg from '../assets/banner.png'; // Background image for banner

const Banner = () => {
    return (
        // Container with background image, full width and height, flex to center content
        <div
            className="relative w-full min-h-screen bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${BannerImg})` }}
        >
            {/* Semi-transparent dark overlay to make text readable */}
            <div className="absolute inset-0 bg-black opacity-70"></div>

            {/* Content area with animation */}
            <motion.div
                initial={{ opacity: 0, y: 30 }} // Start invisible and slightly down
                animate={{ opacity: 1, y: 0 }}  // Animate to visible and original position
                transition={{ duration: 0.6 }}  // Animation duration 0.6 seconds
                viewport={{ once: false }}      // Animate every time in viewport (not only once)
                className="relative text-center text-white z-10 px-4"
            >
                {/* Main heading */}
                <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                    Drive Your Dreams Today!
                </h1>

                {/* Subheading paragraph */}
                <p className="text-lg md:text-xl mb-4 font-poppins">
                    Welcome to Rentizo – your trusted platform for finding and renting top-quality vehicles at unbeatable prices.
                </p>

                {/* Link button to available cars page with hover/tap animations */}
                <Link to="/available-cars">
                    <motion.button
                        whileHover={{ scale: 1.05 }} // Slightly enlarge on hover
                        whileTap={{ scale: 0.95 }}   // Slightly shrink on tap/click
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
