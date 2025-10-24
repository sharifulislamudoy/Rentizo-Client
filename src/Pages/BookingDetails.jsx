import { motion } from 'framer-motion';
import { ReTitle } from 're-title';
import { useEffect, useState } from 'react';
import { FaCar, FaMapMarkerAlt, FaUser, FaShieldAlt } from 'react-icons/fa';
import { IoTime } from 'react-icons/io5';
import { useParams } from 'react-router';
import LoadingSpinner from '../Utils/LoadingSpinner';

const BookingDetails = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://rentizo-server.vercel.app/bookings/${id}`, {
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch booking');
                }
                
                const data = await response.json();
                setBooking(data);
            } catch (error) {
                console.error('Error fetching booking:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!booking) {
        return <div className="text-center py-12">Booking not found</div>;
    }

    // Format dates for display
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Calculate total price
    const calculateTotalPrice = () => {
        const start = new Date(booking.startDate);
        const end = new Date(booking.endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        return days * booking.pricePerDay;
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black text-white min-h-screen">
            <ReTitle title={`Rentizo | Booking #${id}`} />
            <div className="w-11/12 mx-auto">
                {/* Header Section */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Booking Details
                        </span>
                    </h2>
                    <div className="flex justify-center">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                            booking.status === 'Canceled' ? 'bg-red-900 text-red-200' :
                            booking.status === 'Pending' ? 'bg-yellow-900 text-yellow-200' :
                            'bg-green-900 text-green-200'
                        }`}>
                            {booking.status}
                        </span>
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* LEFT COLUMN */}
                    <motion.div
                        className="lg:w-1/2 space-y-6"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {/* Vehicle Image */}
                        <motion.div variants={itemVariants}>
                            <div className="relative rounded-2xl overflow-hidden border border-gray-800">
                                <img
                                    src={booking.carImage}
                                    alt={booking.carModel}
                                    className="w-full h-96 object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                                    <h3 className="text-2xl font-bold">{booking.carModel}</h3>
                                    <p className="text-primary text-lg">${calculateTotalPrice()}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Vehicle Details */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-800"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <FaCar className="text-2xl text-primary" />
                                <h3 className="text-xl font-bold">Vehicle Details</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-gray-800">
                                    <span className="text-gray-400">Model</span>
                                    <span className="text-right">{booking.carModel}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-800">
                                    <span className="text-gray-400">Rental Period</span>
                                    <span className="text-right">
                                        {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-800">
                                    <span className="text-gray-400">Price Per Day</span>
                                    <span className="text-right">${booking.pricePerDay}/day</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-400">Total Price</span>
                                    <span className="text-right">${calculateTotalPrice()}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Location Details */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-800"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <FaMapMarkerAlt className="text-2xl text-primary" />
                                <h3 className="text-xl font-bold">Location Details</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-gray-800">
                                    <span className="text-gray-400">Pickup Location</span>
                                    <span className="text-right">
                                        {booking.pickupLocation?.address || 'Not specified'}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-400">Location Name</span>
                                    <span className="text-right">
                                        {booking.pickupLocation?.name || 'Not specified'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* RIGHT COLUMN */}
                    <motion.div
                        className="lg:w-1/2 space-y-6"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {/* Rental Timeline */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-800"
                        >
                            <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <IoTime className="text-primary" /> Rental Timeline
                            </h4>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-4 h-4 rounded-full bg-primary mt-1"></div>
                                        <div className="w-0.5 h-12 bg-gray-600"></div>
                                    </div>
                                    <div>
                                        <p className="font-medium">Booking {booking.status}</p>
                                        <p className="text-sm text-gray-400">{formatDate(booking.bookingDate)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-4 h-4 rounded-full bg-primary mt-1"></div>
                                        <div className="w-0.5 h-12 bg-gray-600"></div>
                                    </div>
                                    <div>
                                        <p className="font-medium">Pickup Scheduled</p>
                                        <p className="text-sm text-gray-400">{formatDate(booking.startDate)}</p>
                                        <p className="text-sm text-gray-400">{booking.pickupLocation?.address || 'Not specified'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-4 h-4 rounded-full bg-gray-500 mt-1"></div>
                                    </div>
                                    <div>
                                        <p className="font-medium">Return Scheduled</p>
                                        <p className="text-sm text-gray-400">{formatDate(booking.endDate)}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* User Details */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-800"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <FaUser className="text-2xl text-primary" />
                                <h3 className="text-xl font-bold">User Details</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-gray-800">
                                    <span className="text-gray-400">Name</span>
                                    <span className="text-right">{booking.userName}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-400">Email</span>
                                    <span className="text-right">{booking.userEmail}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Booking Info */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-800"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <FaShieldAlt className="text-2xl text-primary" />
                                <h3 className="text-xl font-bold">Booking Info</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-gray-800">
                                    <span className="text-gray-400">Status</span>
                                    <span className="text-right">{booking.status}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-400">Booking Date</span>
                                    <span className="text-right">{formatDate(booking.bookingDate)}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Help Card */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-gradient-to-br from-gray-900 to-primary/10 p-6 rounded-xl border border-primary/20"
                        >
                            <h4 className="text-lg font-bold mb-3">Need help with your booking?</h4>
                            <p className="text-gray-300 mb-4">Our customer support team is available 24/7 to assist you with any questions or issues.</p>
                            <button className="px-4 py-2 bg-transparent border border-primary text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-medium transition">
                                Contact Support
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default BookingDetails;