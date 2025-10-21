import { useEffect, useState } from "react";
import { FaStar, FaGasPump, FaCar, FaRegHeart, FaHeart } from "react-icons/fa";
import { IoPeople, IoCalendar } from "react-icons/io5";
import moment from "moment";
import { motion } from "framer-motion";
import { Link } from "react-router";

const RecentListings = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [favorites, setFavorites] = useState([]);
    const carsPerPage = 6;

    useEffect(() => {
        fetch("http://localhost:3000/cars/")
            .then((res) => res.json())
            .then((data) => {
                const sorted = data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setCars(sorted);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch cars:", err);
                setLoading(false);
            });
    }, []);

    const toggleFavorite = (carId) => {
        setFavorites(prev =>
            prev.includes(carId)
                ? prev.filter(id => id !== carId)
                : [...prev, carId]
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const totalPages = Math.ceil(cars.length / carsPerPage);
    const startIndex = (currentPage - 1) * carsPerPage;
    const visibleCars = cars.slice(startIndex, startIndex + carsPerPage);

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.4,
                ease: "easeOut",
            },
        }),
        hover: {
            scale: 1.03,
            transition: { duration: 0.3 }
        }
    };

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black text-white">
            <div className="w-11/12 mx-auto">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Recent Listings
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
                        Explore our newest additions to the Rentizo fleet
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {visibleCars.map((car, i) => (
                        <motion.div
                            key={car._id || i}
                            custom={i}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            whileHover="hover"
                            viewport={{ once: true, amount: 0.2 }}
                            className="group relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
                        >

                            {/* Car image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={car.image}
                                    alt={car.carModel}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

                                {/* Badge for new listing */}
                                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold z-20">
                                    NEW
                                </div>
                            </div>

                            {/* Car details */}
                            <div className="p-6 relative z-20">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold truncate">{car.carModel}</h3>
                                    <div className="flex items-center bg-gray-700 px-2 py-1 rounded">
                                        <FaStar className="text-yellow-400 mr-1" />
                                        <span className="font-medium">{car.rating || "4.8"}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-primary text-xl font-bold">
                                        ${car.pricePerDay}<span className="text-gray-400 text-sm">/day</span>
                                    </div>
                                    <div className="text-gray-400 text-sm">
                                        {moment(car.createdAt).fromNow()}
                                    </div>
                                </div>

                                {/* Availability and action button */}
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                                    <span className={`flex items-center text-sm ${car.availability === "Available" ? "text-green-400" : "text-red-400"}`}>
                                        {car.availability === "Available" ? (
                                            <>
                                                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                                Available
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                                                Booked
                                            </>
                                        )}
                                    </span>
                                    <Link to={`/car-details/${car._id}`} className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-primary/30 transition-all">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Pagination */}
                {cars.length > carsPerPage && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex justify-center mt-16"
                    >
                        <div className="flex items-center gap-2">
                            <button
                                className="px-4 py-2 rounded-full border border-gray-700 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            >
                                Previous
                            </button>

                            <div className="flex items-center gap-1 mx-4">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${currentPage === pageNum ? 'bg-primary text-white' : 'hover:bg-gray-800'}`}
                                            onClick={() => setCurrentPage(pageNum)}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                className="px-4 py-2 rounded-full border border-gray-700 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            >
                                Next
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default RecentListings;