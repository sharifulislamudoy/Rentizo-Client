import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ReTitle } from 're-title';
import { FaCar, FaHeart, FaUserCog, FaHistory, FaHeadset, FaBars, FaTimes, FaGasPump, FaHome } from 'react-icons/fa';
import { AuthContext } from '../../Provider/AuthProvider';
import LoadingSpinner from '../../Utils/LoadingSpinner';
import { Link } from 'react-router';
import { toast } from 'react-toastify';

const UserDashboard = () => {
    const { user, updateUserProfile } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('bookings');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        state: '',
        zipCode: '',
        dob: '',
        gender: '',
        bio: ''
    });
    const [profileLoading, setProfileLoading] = useState(false);

    useEffect(() => {
        if (user?.email) {
            // Fetch user bookings
            fetch(`http://localhost:3000/bookings?email=${user.email}`, {
                credentials: 'include',
            })
                .then((res) => res.json())
                .then((data) => {
                    const bookingsWithCalculatedPrice = data.map(booking => {
                        const startDate = new Date(booking.startDate);
                        const endDate = new Date(booking.endDate);
                        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
                        const totalPrice = days * booking.pricePerDay;
                        return {
                            ...booking,
                            totalPrice: `$${totalPrice}`,
                            dates: `${formatDate(startDate)} - ${formatDate(endDate)}`
                        };
                    });
                    setBookings(bookingsWithCalculatedPrice);
                })
                .catch(() => setLoading(false));

            // Fetch user profile data
            fetch(`http://localhost:3000/users/${user.email}`, {
                credentials: 'include',
            })
                .then(res => res.json())
                .then(data => {
                    if (data) {
                        setProfileData({
                            name: data.name || user.displayName || '',
                            email: data.email || user.email || '',
                            phoneNumber: data.phoneNumber || '',
                            address: data.address || '',
                            state: data.state || '',
                            zipCode: data.zipCode || '',
                            dob: data.dob || '',
                            gender: data.gender || '',
                            bio: data.bio || ''
                        });
                    }
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [user]);

    useEffect(() => {
        if (activeTab === 'wishlist') {
            fetchWishlistData();
        }
    }, [activeTab]);

    const fetchWishlistData = () => {
        setWishlistLoading(true);
        const wishlistIds = JSON.parse(localStorage.getItem('wishlist')) || [];

        if (wishlistIds.length === 0) {
            setWishlist([]);
            setWishlistLoading(false);
            return;
        }

        fetch('http://localhost:3000/cars')
            .then(res => res.json())
            .then(allCars => {
                const wishlistCars = allCars.filter(car => wishlistIds.includes(car._id));
                setWishlist(wishlistCars);
                setWishlistLoading(false);
            })
            .catch(() => {
                setWishlistLoading(false);
            });
    };

    const removeFromWishlist = (carId) => {
        let wishlistIds = JSON.parse(localStorage.getItem('wishlist')) || [];
        wishlistIds = wishlistIds.filter(id => id !== carId);
        localStorage.setItem('wishlist', JSON.stringify(wishlistIds));
        fetchWishlistData();
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileLoading(true);

        try {
            // Update in Firebase if name changed
            if (profileData.name !== user.displayName) {
                await updateUserProfile({
                    displayName: profileData.name
                });
            }

            // Update in MongoDB
            const response = await fetch(`http://localhost:3000/users/${user.email}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(profileData)
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Profile updated successfully');
            } else {
                throw new Error(data.message || 'Failed to update profile');
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setProfileLoading(false);
        }
    };

    const paymentHistory = [
        {
            id: 1,
            date: "15 Oct 2023",
            amount: "$350",
            method: "Credit Card",
            status: "completed"
        },
        {
            id: 2,
            date: "10 Sep 2023",
            amount: "$420",
            method: "PayPal",
            status: "completed"
        }
    ];

    const tabs = [
        { id: 'bookings', label: 'Bookings', icon: <FaCar /> },
        { id: 'wishlist', label: 'Wishlist', icon: <FaHeart /> },
        { id: 'profile', label: 'Profile', icon: <FaUserCog /> },
        { id: 'payments', label: 'Payment', icon: <FaHistory /> },
        { id: 'support', label: 'Support', icon: <FaHeadset /> }
    ];

    if (loading) {
        return <LoadingSpinner />
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'bookings':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold mb-6">Your Bookings</h2>
                        {bookings.length === 0 ? (
                            <div className="text-center py-12 bg-gray-900 rounded-xl">
                                <p className="text-gray-400">No bookings yet</p>
                            </div>
                        ) : (
                            bookings.map(booking => (
                                <motion.div
                                    key={booking._id}
                                    whileHover={{ scale: 1.01 }}
                                    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 overflow-hidden"
                                >
                                    <div className="flex flex-col md:flex-row">
                                        <div className="md:w-1/3">
                                            <img
                                                src={booking.carImage}
                                                alt={booking.carModel}
                                                className="w-full h-63 object-cover"
                                            />
                                        </div>
                                        <div className="p-6 md:w-2/3">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-xl font-bold">{booking.carModel}</h3>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'Canceled'
                                                        ? 'bg-red-900 text-red-200'
                                                        : booking.status === 'Pending'
                                                            ? 'bg-yellow-900 text-yellow-200'
                                                            : booking.status === 'Confirmed'
                                                                ? 'bg-green-900 text-green-200'
                                                                : 'bg-gray-800 text-gray-200'
                                                        }`}
                                                >
                                                    {booking.status || 'Confirmed'}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <p className="text-gray-400 text-sm">Dates</p>
                                                    <p>{booking.dates}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-sm">Total Price</p>
                                                    <p className="text-primary">{booking.totalPrice}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-sm">Pickup Location</p>
                                                    <p>{booking.pickupLocation.address}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-sm">Price Per Day</p>
                                                    <p>${booking.pricePerDay}/day</p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-3 mt-4">
                                                <Link
                                                    to={`/booking-details/${booking._id}`}
                                                    className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg transition"
                                                >
                                                    View Details
                                                </Link>
                                                {booking.status === 'Pending' && (
                                                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition">
                                                        Cancel Booking
                                                    </button>
                                                )}
                                                <button className='bg-green-600 px-4 py-2 rounded-lg transition'>
                                                    <Link>
                                                        Payment
                                                    </Link>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                );
            case 'wishlist':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold mb-6">Your Wishlist</h2>
                        {wishlistLoading ? (
                            <div className="text-center py-12">
                                <LoadingSpinner />
                            </div>
                        ) : wishlist.length === 0 ? (
                            <div className="text-center py-12 bg-gray-900 rounded-xl">
                                <p className="text-gray-400">Your wishlist is empty</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {wishlist.map(car => (
                                    <motion.div
                                        key={car._id}
                                        whileHover={{ y: -5 }}
                                        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 overflow-hidden hover:border-primary transition-all"
                                    >
                                        <img
                                            src={car.image}
                                            alt={car.carModel}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-6">
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="text-lg font-bold">{car.carModel}</h3>
                                                <button
                                                    onClick={() => removeFromWishlist(car._id)}
                                                    className="text-red-500 hover:text-red-400"
                                                    aria-label="Remove from wishlist"
                                                >
                                                    <FaHeart />
                                                </button>
                                            </div>
                                            <p className="text-primary mb-4">${car.pricePerDay}/day</p>
                                            <div className="grid grid-cols-2 gap-2 mb-4">
                                                <div className="flex items-center text-sm">
                                                    <FaGasPump className="mr-2 text-gray-400" />
                                                    <span>{car.fuelType || 'Gasoline'}</span>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                    <FaCar className="mr-2 text-gray-400" />
                                                    <span>{car.type || 'Sedan'}</span>
                                                </div>
                                            </div>
                                            <button className="w-full py-2 bg-primary hover:bg-primary-dark rounded-lg transition">
                                                <Link
                                                    to={`/car-details/${car._id}`}
                                                    className="block w-full"
                                                >
                                                    Book Now
                                                </Link>
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'profile':
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
                            <form onSubmit={handleProfileSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    {/* Profile Media */}
                                    <div className="md:col-span-2">
                                        <label className="block text-gray-400 mb-2">Profile Picture</label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden">
                                                {user.photoURL ? (
                                                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-2xl">
                                                        {user.displayName?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                id="profile-picture"
                                            />
                                            <label htmlFor="profile-picture" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition cursor-pointer">
                                                Change Photo
                                            </label>
                                        </div>
                                    </div>
                                    {/* Personal Information */}
                                    <div>
                                        <label className="block text-gray-400 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleProfileChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 mb-2">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleProfileChange}
                                            disabled
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={profileData.phoneNumber}
                                            onChange={handleProfileChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    {/* Location Information */}
                                    <div>
                                        <label className="block text-gray-400 mb-2">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={profileData.address}
                                            onChange={handleProfileChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 mb-2">State/Province</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={profileData.state}
                                            onChange={handleProfileChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 mb-2">Zip/Postal Code</label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={profileData.zipCode}
                                            onChange={handleProfileChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    {/* Personal Details */}
                                    <div>
                                        <label className="block text-gray-400 mb-2">Date of Birth</label>
                                        <input
                                            type="date"
                                            name="dob"
                                            value={profileData.dob}
                                            onChange={handleProfileChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 mb-2">Gender</label>
                                        <select
                                            name="gender"
                                            value={profileData.gender}
                                            onChange={handleProfileChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="">Prefer not to say</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    {/* Bio/About */}
                                    <div className="md:col-span-2">
                                        <label className="block text-gray-400 mb-2">Bio/About</label>
                                        <textarea
                                            name="bio"
                                            value={profileData.bio}
                                            onChange={handleProfileChange}
                                            rows="3"
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Tell us about yourself..."
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-primary hover:bg-primary-dark rounded-lg transition disabled:opacity-50"
                                        disabled={profileLoading}
                                    >
                                        {profileLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                                        onClick={() => window.location.reload()}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                );
            case 'payments':
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Payment History</h2>
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Payment Method</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {paymentHistory.map(payment => (
                                            <tr key={payment.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{payment.date}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-primary">{payment.amount}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{payment.method}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${payment.status === 'completed' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                                                        }`}>
                                                        {payment.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button className="text-primary hover:underline">Invoice</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case 'support':
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Support & Feedback</h2>
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-4">Contact Support</h3>
                                <p className="text-gray-400 mb-4">Our team is available 24/7 to assist you with any questions or issues.</p>
                                <div className="space-y-2">
                                    <p><span className="text-gray-400">Email:</span> support@rentizo.com</p>
                                    <p><span className="text-gray-400">Phone:</span> +1 (800) 123-4567</p>
                                    <p><span className="text-gray-400">Live Chat:</span> Available on the website</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-4">Send Feedback</h3>
                                <form className="space-y-4">
                                    <div>
                                        <label className="block text-gray-400 mb-2">Subject</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 mb-2">Message</label>
                                        <textarea
                                            rows="4"
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        ></textarea>
                                    </div>
                                    <button className="px-6 py-3 bg-primary hover:bg-primary-dark rounded-lg transition">
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <section className="py-8 bg-black text-white min-h-screen">
            <ReTitle title="Dashboard" />
            <div className="w-11/12 mx-auto">
                {/* Mobile menu button */}
                <div className="md:hidden flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Dashboard
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
                                <img src={user.photoURL} alt="" className='rounded-full w-12 h-12' />
                                <div>
                                    <h3 className="font-bold text-md">{user.displayName}</h3>
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
                                    <img src={user.photoURL} alt="" className='rounded-full w-12 h-12' />
                                    <div>
                                        <h3 className="font-bold">{user.displayName}</h3>
                                    </div>
                                </div>
                                <nav className="space-y-2">
                                    <Link
                                        to="/"
                                        onClick={() => setMobileMenuOpen(false)}
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
        </section>
    );
};

export default UserDashboard;