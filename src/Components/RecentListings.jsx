import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // Icons for availability status
import moment from "moment"; // Library to format dates
import { motion } from "framer-motion"; // For animation effects

const RecentListings = () => {
    // State to store car listings
    const [cars, setCars] = useState([]);
    // State to track loading status while fetching data
    const [loading, setLoading] = useState(true);
    // State to control whether to show all listings or just a few
    const [showAll, setShowAll] = useState(false);

    // useEffect runs once after the component mounts
    // It fetches car data from the server
    useEffect(() => {
        fetch("https://rentizo-server.vercel.app/cars/")
            .then((res) => res.json())
            .then((data) => {
                // Sort cars by creation date (newest first)
                const sorted = data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setCars(sorted); // Save sorted cars in state
                setLoading(false); // Data loaded, stop loading state
            })
            .catch((err) => {
                // Handle any errors during fetch
                console.error("Failed to fetch cars:", err);
                setLoading(false); // Stop loading even if error occurs
            });
    }, []);

    // Show loading text while data is being fetched
    if (loading) {
        return <p className="text-center py-10">Loading car listings...</p>;
    }

    // Decide how many cars to show: all or first 6
    const visibleCars = showAll ? cars : cars.slice(0, 6);

    // Animation settings for each car card (fade and slide up)
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1, // stagger animation by index
                duration: 0.4,
                ease: "easeOut",
            },
        }),
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }} // Animate container fade in and move up
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="px-4 py-8 my-3 w-full max-w-6xl mx-auto overflow-x-hidden min-h-screen"
        >
            <h2 className="text-4xl md:text-5xl font-bold mb-12 font-poppins text-primary text-center">
                Recent Listings
            </h2>

            {/* Grid container for car cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-base-100">
                {visibleCars.map((car, i) => (
                    <motion.div
                        key={car._id || i}
                        custom={i} // Pass index to animation variants
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                        className="bg-base-300 rounded-2xl overflow-hidden shadow hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                        {/* Car image */}
                        <img
                            src={car.image}
                            alt={car.carModel}
                            className="w-full h-48 object-cover"
                        />
                        {/* Car details */}
                        <div className="p-4 space-y-2">
                            <h3 className="text-xl font-bold text-primary">{car.carModel}</h3>
                            <p className="text-gray-700">${car.pricePerDay}/day</p>

                            {/* Availability status with icon */}
                            <div className="flex items-center gap-2">
                                {car.availability === "Available" ? (
                                    <span className="text-green-600 flex items-center gap-1">
                                        <FaCheckCircle /> Available
                                    </span>
                                ) : (
                                    <span className="text-red-600 flex items-center gap-1">
                                        <FaTimesCircle /> Unavailable
                                    </span>
                                )}
                            </div>

                            <p className="text-sm text-gray-500">Bookings: {car.bookingCount}</p>
                            {/* Show how long ago the listing was added */}
                            <p className="text-sm text-gray-400">
                                Added {moment(car.createdAt).fromNow()}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Show toggle button if there are more than 6 cars */}
            {cars.length > 6 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-8"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAll(!showAll)}
                        className="btn btn-primary"
                    >
                        {showAll ? "Show Less" : "See All"}
                    </motion.button>
                </motion.div>
            )}
        </motion.div>
    );
};

export default RecentListings;
