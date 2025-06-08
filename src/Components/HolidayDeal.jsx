import { motion } from "framer-motion";
import { FaCarSide } from "react-icons/fa";
import { Link } from "react-router";
import useScrollToTop from "../Utils/UseScrollToTop";

const HolidayDeal = () => {
    useScrollToTop();
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto my-10 px-6"
        >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-6 md:mb-0 md:w-2/3">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Holiday Luxury Deal 🎉
                        </h2>
                        <p className="text-lg md:text-xl mb-4">
                            <span className="font-semibold">Luxury cars</span> starting at just{" "}
                            <span className="font-bold">$99/day</span> this holiday season.
                        </p>
                        <Link to={'/available-cars'}><button className="bg-white text-indigo-600 hover:bg-gray-100 transition px-6 py-2 rounded-full font-medium shadow-md">
                            Book Now
                        </button></Link>
                    </div>
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        className="text-[100px] text-white/30"
                    >
                        <FaCarSide />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default HolidayDeal;
