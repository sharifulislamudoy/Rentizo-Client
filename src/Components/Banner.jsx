import { Link } from 'react-router'; 
import { motion } from 'framer-motion'; 
import BannerImg from '../assets/Banner1.png';

const Banner = () => {
    return (
        <div className="relative w-full h-[80vh] overflow-hidden">
            {/* Modern layered background */}
            <div className="absolute inset-0 bg-black/30 z-0"></div>
            <div 
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ 
                    backgroundImage: `url(${BannerImg})`,
                    filter: 'brightness(0.8) contrast(1.2)'
                }}
            ></div>
            
            {/* Floating abstract shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <motion.div 
                    className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-primary/10 blur-lg"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div 
                    className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-secondary/10 blur-lg"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Main content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 px-4 sm:px-6 py-8 mx-auto max-w-6xl h-full flex flex-col justify-center"
            >
                <div className="backdrop-blur-sm bg-white/5 p-6 sm:p-8 md:p-10 rounded-2xl border border-white/10 shadow-lg">
                    {/* Typography */}
                    <div className="mb-6">
                        <motion.h1 
                            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-snug"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                Rent Premium
                            </span>
                            <br />
                            <span className="text-white">Cars in 60 Seconds</span>
                        </motion.h1>
                        
                        <motion.p 
                            className="text-sm sm:text-base text-white/80 max-w-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Experience seamless car rentals with our fully digital process.
                        </motion.p>
                    </div>

                    {/* Search/CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-3 mb-8"
                    >
                        <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg p-0.5 border border-white/20 flex">
                            <input 
                                type="text" 
                                placeholder="Search location or brand..." 
                                className="flex-1 bg-transparent border-none text-white placeholder-white/50 px-3 py-2 sm:px-4 sm:py-2.5 text-sm focus:outline-none"
                            />
                            <button className="px-3 text-white/50 hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                        <Link to="/available-cars" className="flex-shrink-0">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary text-white px-6 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold text-sm sm:text-base shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all"
                            >
                                Explore Fleet
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                    >
                        {[
                            { value: "500+", label: "Vehicles" },
                            { value: "24/7", label: "Support" },
                            { value: "5★", label: "Rated" },
                            { value: "0%", label: "Fees" }
                        ].map((stat, index) => (
                            <div key={index} className="bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                                <div className="text-xl font-bold text-primary">{stat.value}</div>
                                <div className="text-xs text-white/70">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/50 flex flex-col items-center"
                >
                    <span className="text-xs mb-1">Scroll down</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="h-4"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Banner;