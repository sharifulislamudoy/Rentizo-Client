import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import moment from "moment";

const RecentListings = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:3000/cars/")
            .then((res) => res.json())
            .then((data) => {
                setCars(data);
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

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 my-3">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 font-poppins text-primary text-center">Recent Listings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {cars.map((car) => (
                    <div
                        key={car._id}
                        className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                        <img
                            src={car.image}
                            alt={car.carModel}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4 space-y-2">
                            <h3 className="text-xl font-bold">{car.carModel}</h3>
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
                            <p className="text-sm text-gray-500">
                                Bookings: {car.bookingCount}
                            </p>
                            <p className="text-sm text-gray-400">
                                Added {moment(car.createdAt).fromNow()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentListings;
