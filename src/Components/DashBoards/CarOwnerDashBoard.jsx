import { useState } from 'react';
import { motion } from 'framer-motion';
import { ReTitle } from 're-title';
import { FaCar, FaCarAlt, FaMoneyBillWave, FaUserCog, FaStar, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaBars, FaHome } from 'react-icons/fa';
import { MdDashboard, MdReceipt } from 'react-icons/md';
import { BsCalendarCheck } from 'react-icons/bs';
import { Link } from 'react-router';

const CarOwnerDashboard = () => {
    const [activeTab, setActiveTab] = useState('myCars');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showAddCarModal, setShowAddCarModal] = useState(false);

    // Sample data
    const myCars = [
        {
            id: 1,
            model: "Toyota Camry 2022",
            image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
            price: "$85/day",
            status: "available",
            rating: 4.7,
            trips: 12
        },
        {
            id: 2,
            model: "Honda Civic 2021",
            image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
            price: "$75/day",
            status: "maintenance",
            rating: 4.5,
            trips: 8
        }
    ];

    const bookings = [
        {
            id: 1,
            car: "Toyota Camry 2022",
            image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
            user: "John Smith",
            dates: "15 Oct - 20 Oct 2023",
            price: "$425",
            status: "pending"
        },
        {
            id: 2,
            car: "Honda Civic 2021",
            image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
            user: "Sarah Johnson",
            dates: "25 Nov - 30 Nov 2023",
            price: "$375",
            status: "confirmed"
        }
    ];

    const earnings = {
        totalEarnings: "$2,450",
        pendingPayout: "$850",
        completedPayouts: "$1,600",
        recentTransactions: [
            {
                id: 1,
                date: "15 Oct 2023",
                amount: "$425",
                status: "paid"
            },
            {
                id: 2,
                date: "10 Sep 2023",
                amount: "$375",
                status: "paid"
            }
        ]
    };

    const reviews = [
        {
            id: 1,
            car: "Toyota Camry 2022",
            user: "John Smith",
            rating: 5,
            comment: "Great car and excellent service from the owner!",
            date: "15 Oct 2023"
        },
        {
            id: 2,
            car: "Honda Civic 2021",
            user: "Sarah Johnson",
            rating: 4,
            comment: "Good condition, but the fuel efficiency wasn't as good as expected.",
            date: "5 Sep 2023"
        }
    ];

    const tabs = [
        { id: 'myCars', label: 'My Cars', icon: <FaCarAlt /> },
        { id: 'bookings', label: 'Bookings', icon: <BsCalendarCheck /> },
        { id: 'earnings', label: 'Earnings', icon: <FaMoneyBillWave /> },
        { id: 'reviews', label: 'Reviews', icon: <FaStar /> },
        { id: 'profile', label: 'Settings', icon: <FaUserCog /> }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'myCars':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">My Cars</h2>
                            <button
                                onClick={() => setShowAddCarModal(true)}
                                className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg transition"
                            >
                                <FaPlus /> <span>Add New Car</span>
                            </button>
                        </div>

                        {myCars.length === 0 ? (
                            <div className="text-center py-12 bg-gray-900 rounded-xl">
                                <p className="text-gray-400">You haven't listed any cars yet</p>
                                <button
                                    onClick={() => setShowAddCarModal(true)}
                                    className="mt-4 px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg transition"
                                >
                                    List Your First Car
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {myCars.map(car => (
                                    <motion.div
                                        key={car.id}
                                        whileHover={{ y: -5 }}
                                        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 overflow-hidden hover:border-primary transition-all"
                                    >
                                        <div className="relative">
                                            <img
                                                src={car.image}
                                                alt={car.model}
                                                className="w-full h-48 object-cover"
                                            />
                                            <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs ${car.status === 'available' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                                                }`}>
                                                {car.status}
                                            </span>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold">{car.model}</h3>
                                                <div className="flex items-center space-x-1">
                                                    <FaStar className="text-yellow-400" />
                                                    <span>{car.rating}</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <p className="text-gray-400 text-sm">Price</p>
                                                    <p className="text-primary">{car.price}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-sm">Trips</p>
                                                    <p>{car.trips}</p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-3">
                                                <button className="flex-1 py-2 bg-primary hover:bg-primary-dark rounded-lg transition flex items-center justify-center space-x-2">
                                                    <FaEdit /> <span>Edit</span>
                                                </button>
                                                <button className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition flex items-center justify-center space-x-2">
                                                    <FaTrash /> <span>Delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'bookings':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Bookings Received</h2>

                        {bookings.length === 0 ? (
                            <div className="text-center py-12 bg-gray-900 rounded-xl">
                                <p className="text-gray-400">No bookings yet</p>
                            </div>
                        ) : (
                            bookings.map(booking => (
                                <motion.div
                                    key={booking.id}
                                    whileHover={{ scale: 1.01 }}
                                    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 overflow-hidden"
                                >
                                    <div className="flex flex-col md:flex-row">
                                        <div className="md:w-1/3">
                                            <img
                                                src={booking.image}
                                                alt={booking.car}
                                                className="w-full h-48 object-cover"
                                            />
                                        </div>
                                        <div className="p-6 md:w-2/3">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold">{booking.car}</h3>
                                                    <p className="text-gray-400">Booked by: {booking.user}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs ${booking.status === 'confirmed' ? 'bg-green-900 text-green-300' :
                                                    booking.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                                                        'bg-red-900 text-red-300'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <p className="text-gray-400 text-sm">Dates</p>
                                                    <p>{booking.dates}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-sm">Total Earnings</p>
                                                    <p className="text-primary">{booking.price}</p>
                                                </div>
                                            </div>
                                            {booking.status === 'pending' && (
                                                <div className="flex space-x-3 mt-4">
                                                    <button className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition flex items-center justify-center space-x-2">
                                                        <FaCheck /> <span>Accept</span>
                                                    </button>
                                                    <button className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition flex items-center justify-center space-x-2">
                                                        <FaTimes /> <span>Reject</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                );
            case 'earnings':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Earnings Summary</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
                                <h3 className="text-gray-400 mb-2">Total Earnings</h3>
                                <p className="text-3xl font-bold text-primary">{earnings.totalEarnings}</p>
                            </div>
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
                                <h3 className="text-gray-400 mb-2">Pending Payout</h3>
                                <p className="text-3xl font-bold text-yellow-400">{earnings.pendingPayout}</p>
                            </div>
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
                                <h3 className="text-gray-400 mb-2">Completed Payouts</h3>
                                <p className="text-3xl font-bold text-green-400">{earnings.completedPayouts}</p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
                            <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Invoice</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {earnings.recentTransactions.map(transaction => (
                                            <tr key={transaction.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{transaction.date}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-primary">{transaction.amount}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${transaction.status === 'paid' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                                                        }`}>
                                                        {transaction.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button className="text-primary hover:underline">Download</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
                            <h3 className="text-xl font-bold mb-4">Payout Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-400 mb-2">Payout Method</label>
                                    <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                                        <option>Bank Transfer</option>
                                        <option>PayPal</option>
                                        <option>Stripe</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Bank Account Number</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your account number"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>
                            <button className="mt-6 px-6 py-3 bg-primary hover:bg-primary-dark rounded-lg transition">
                                Update Payout Settings
                            </button>
                        </div>
                    </div>
                );
            case 'reviews':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Customer Reviews</h2>

                        {reviews.length === 0 ? (
                            <div className="text-center py-12 bg-gray-900 rounded-xl">
                                <p className="text-gray-400">No reviews yet</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map(review => (
                                    <div key={review.id} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold">{review.car}</h3>
                                            <div className="flex items-center space-x-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar
                                                        key={i}
                                                        className={i < review.rating ? "text-yellow-400" : "text-gray-600"}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-400 text-sm mb-2">By {review.user} • {review.date}</p>
                                        <p className="mt-2">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6 mt-6">
                            <h3 className="text-xl font-bold mb-4">Your Average Rating</h3>
                            <div className="flex items-center space-x-4">
                                <div className="text-5xl font-bold">4.6</div>
                                <div className="flex flex-col">
                                    <div className="flex items-center space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar
                                                key={i}
                                                className={i < 4 ? "text-yellow-400" : "text-gray-600"}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-400 text-sm">Based on 20 reviews</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'profile':
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-gray-400 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Car Owner"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Email</label>
                                    <input
                                        type="email"
                                        defaultValue="owner@example.com"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        defaultValue="+1 234 567 890"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Address</label>
                                    <input
                                        type="text"
                                        defaultValue="123 Owner St, City"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-4">Business Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-400 mb-2">Business Name</label>
                                        <input
                                            type="text"
                                            placeholder="Your business name (if applicable)"
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 mb-2">Tax ID</label>
                                        <input
                                            type="text"
                                            placeholder="Tax identification number"
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                            </div>
                            <button className="px-6 py-3 bg-primary hover:bg-primary-dark rounded-lg transition">
                                Save Changes
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <section className="py-8 bg-black text-white min-h-screen">
            <ReTitle title="Rentizo | Owner Dashboard" />
            <div className="w-11/12 mx-auto">
                {/* Mobile menu button */}
                <div className="md:hidden flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Owner Dashboard
                        </span>
                    </h1>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-gray-400 hover:text-white focus:outline-none"
                    >
                        {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar - Desktop */}
                    <div className="hidden md:block w-[200px]">
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6 sticky top-8">
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                                    <span className="text-xl font-bold">CO</span>
                                </div>
                                <div>
                                    <h3 className="font-bold">Car Owner</h3>
                                </div>
                            </div>
                            <nav className="space-y-2">
                                <Link
                                    to="/"
                                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition text-gray-400 hover:bg-gray-800 hover:text-white"
                                >
                                    <span><FaHome /></span>
                                    <span>Home Page</span>
                                </Link>
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === tab.id
                                            ? 'bg-primary text-white'
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                            }`}
                                    >
                                        <span>{tab.icon}</span>
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-90 p-6 overflow-y-auto">
                            <div className="flex justify-end mb-6">
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <FaTimes size={24} />
                                </button>
                            </div>
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
                                <div className="flex items-center space-x-3 mb-8">
                                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                                        <span className="text-xl font-bold">CO</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Car Owner</h3>
                                    </div>
                                </div>
                                <nav className="space-y-2">
                                    <Link
                                        to="/"
                                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition text-gray-400 hover:bg-gray-800 hover:text-white"
                                    >
                                        <span><FaHome /></span>
                                        <span>Home Page</span>
                                    </Link>
                                    {tabs.map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => {
                                                setActiveTab(tab.id);
                                                setMobileMenuOpen(false);
                                            }}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === tab.id
                                                ? 'bg-primary text-white'
                                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                                }`}
                                        >
                                            <span>{tab.icon}</span>
                                            <span>{tab.label}</span>
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="w-full md:w-3/4 lg:w-4/5">
                        {renderTabContent()}
                    </div>
                </div>
            </div>

            {/* Add Car Modal */}
            {showAddCarModal && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6 w-full max-w-2xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Add New Car</h3>
                            <button
                                onClick={() => setShowAddCarModal(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 mb-2">Make</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Model</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-gray-400 mb-2">Year</label>
                                    <input
                                        type="number"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Price per day ($)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Vehicle Type</label>
                                    <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                                        <option>Sedan</option>
                                        <option>SUV</option>
                                        <option>Truck</option>
                                        <option>Luxury</option>
                                        <option>Sports</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2">Description</label>
                                <textarea
                                    rows="3"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2">Car Photos</label>
                                <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                                    <p className="text-gray-400 mb-2">Drag & drop images here or click to browse</p>
                                    <button className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg transition">
                                        Upload Images
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 mb-2">Location</label>
                                    <input
                                        type="text"
                                        placeholder="Where is the car located?"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Availability</label>
                                    <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                                        <option>Available</option>
                                        <option>Not Available</option>
                                        <option>Maintenance</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowAddCarModal(false)}
                                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button className="px-6 py-2 bg-primary hover:bg-primary-dark rounded-lg transition">
                                    Add Car
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </section>
    );
};

export default CarOwnerDashboard;