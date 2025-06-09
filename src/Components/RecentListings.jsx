import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import moment from "moment";
import { motion } from "framer-motion";

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.4,
            ease: "easeOut",
        },
    }),
};

const RecentListings = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);

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

    if (loading) {
        return <p className="text-center py-10">Loading car listings...</p>;
    }

    const visibleCars = showAll ? cars : cars.slice(0, 6);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: false, amount: 0.3 }}
            className="px-4 py-8 my-3 w-full max-w-6xl mx-auto"
        >
            <h2 className="text-4xl md:text-5xl font-bold mb-12 font-poppins text-primary text-center">
                Recent Listings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-base-100">
                {visibleCars.map((car, i) => (
                    <motion.div
                        key={car._id}
                        custom={i}
                        initial="hidden"
                        whileInView="visible"
                        variants={cardVariants}
                        className="bg-base-300 rounded-2xl overflow-hidden shadow hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                        viewport={{ once: false }}
                    >
                        <img
                            src={car.image}
                            alt={car.carModel}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4 space-y-2">
                            <h3 className="text-xl font-bold text-primary">{car.carModel}</h3>
                            <p className="text-gray-700">${car.pricePerDay}/day</p>
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
                            <p className="text-sm text-gray-400">
                                Added {moment(car.createdAt).fromNow()}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {cars.length > 6 && (
                <div className="text-center mt-8">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="btn btn-primary"
                    >
                        {showAll ? "Show Less" : "See All"}
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default RecentListings;
