import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import moment from "moment";
import { motion } from "framer-motion";

const RecentListings = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const carsPerPage = 6;

    useEffect(() => {
        fetch("https://rentizo-server.vercel.app/cars/")
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
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="px-4 py-8 my-3 w-full max-w-6xl mx-auto overflow-x-hidden min-h-screen"
        >
            <h2 className="text-4xl md:text-5xl font-bold mb-12 font-poppins text-primary text-center">
                Recent Listings
            </h2>
            

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-base-100">
                {visibleCars.map((car, i) => (
                    <motion.div
                        key={car._id || i}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                    >
                        <div className="card bg-base-100 image-full shadow-sm mx-auto">
                            <figure>
                                <img
                                    src={car.image}
                                    alt={car.carModel}
                                    className="object-cover w-full h-full"
                                />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">{car.carModel}</h2>
                                <p>
                                    ${car.pricePerDay}/day <br />
                                    Bookings: {car.bookingCount} <br />
                                    Added {moment(car.createdAt).fromNow()} <br />
                                    {car.availability === "Available" ? (
                                        <span className="text-green-300 flex items-center gap-1">
                                            <FaCheckCircle /> Available
                                        </span>
                                    ) : (
                                        <span className="text-red-300 flex items-center gap-1">
                                            <FaTimesCircle /> Unavailable
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Pagination buttons */}
            {cars.length > carsPerPage && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center mt-10"
                >
                    <div className="join grid grid-cols-2">
                        <button
                            className="join-item btn btn-outline"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        >
                            Previous page
                        </button>
                        <button
                            className="join-item btn btn-outline"
                            disabled={currentPage === totalPages}
                            onClick={() =>
                                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }
                        >
                            Next
                        </button>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default RecentListings;
