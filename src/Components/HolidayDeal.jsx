import { motion } from "framer-motion"; // For animation effects
import { FaCarSide } from "react-icons/fa"; // Car icon
import { Link } from "react-router"; // For navigation without page reload
import useScrollToTop from "../Utils/UseScrollToTop"; // Custom hook to scroll to top on page load

const HolidayDeal = () => {
    // Scroll page to top when this component loads
    useScrollToTop();

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}           // Start invisible and slightly down
            whileInView={{ opacity: 1, y: 0 }}        // Animate to visible and original position when in viewport
            transition={{ duration: 0.6, ease: "easeOut" }} // Smooth transition
            viewport={{ once: true }}                  // Animate only once
            className="max-w-5xl mx-auto my-10 px-6"  // Container styling with margins and padding
        >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
                {/* Flex container for content and icon */}
                <div className="flex flex-col md:flex-row items-center justify-between">
                    {/* Text content */}
                    <div className="mb-6 md:mb-0 md:w-2/3">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Holiday Luxury Deal 🎉
                        </h2>
                        <p className="text-lg md:text-xl mb-4">
                            <span className="font-semibold">Luxury cars</span> starting at just{" "}
                            <span className="font-bold">$99/day</span> this holiday season.
                        </p>
                        {/* Button linking to available cars page */}
                        <Link to={'/available-cars'}>
                            <button className="bg-white text-indigo-600 hover:bg-gray-100 transition px-6 py-2 rounded-full font-medium shadow-md">
                                Book Now
                            </button>
                        </Link>
                    </div>

                    {/* Decorative car icon with scale animation */}
                    <motion.div
                        initial={{ scale: 0.8 }}              // Start slightly smaller
                        animate={{ scale: 1 }}                // Scale up to full size
                        transition={{ duration: 0.4, delay: 0.3 }} // Smooth scale with delay
                        className="text-[100px] text-white/30" // Large, semi-transparent icon
                    >
                        <FaCarSide />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default HolidayDeal;
