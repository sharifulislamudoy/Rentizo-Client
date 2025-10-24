import { Link } from 'react-router';
import { motion } from 'framer-motion';
import BannerImg from '../assets/Banner1.png';
import CountUp from 'react-countup';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Banner = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch matches from backend
    const fetchMatches = async (query) => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        try {
            setIsLoading(true);
            const { data } = await axios.get("https://rentizo-server.vercel.app/cars");

            const filtered = data.filter(car =>
                car.location.toLowerCase().includes(query.toLowerCase()) ||
                car.carModel.toLowerCase().includes(query.toLowerCase())
            );

            setResults(filtered);
        } catch (error) {
            console.error("Error fetching cars:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchMatches(searchTerm);
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

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
                        {/* Search box wrapper */}
                        <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg p-0.5 border border-white/20 flex relative z-50">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search location or brand..."
                                className="flex-1 bg-transparent border-none text-white placeholder-white/50 px-3 py-2 sm:px-4 sm:py-2.5 text-sm focus:outline-none"
                            />
                            <button className="px-3 text-white/50 hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            {/* Dropdown results */}
                            {searchTerm && results.length > 0 && (
                                <div className="absolute top-full left-0 w-full bg-gray-950 text-primary rounded-b-lg shadow-lg max-h-60 overflow-y-auto z-50">
                                    {results.map((car) => (
                                        <Link
                                            key={car._id}
                                            to={`/car-details/${car._id}`}
                                            className="block px-4 py-2 hover:bg-primary/10"
                                        >
                                            {car.carModel} - {car.location}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* No results */}
                            {searchTerm && !isLoading && results.length === 0 && (
                                <div className="absolute top-full left-0 w-full bg-gray-950 rounded-b-lg shadow-lg px-4 py-2 z-50">
                                    No cars found
                                </div>
                            )}
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
                            { value: 500, suffix: "+", label: "Vehicles" },
                            { value: 24, suffix: "/7", label: "Support" },
                            { value: 5, suffix: "★", label: "Rated" },
                            { value: 0, suffix: "%", label: "Fees" }
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10 text-center"
                            >
                                <div className="text-xl font-bold text-primary">
                                    <CountUp end={stat.value} duration={5} suffix={stat.suffix} />
                                </div>
                                <div className="text-xs text-white/70">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Banner;
