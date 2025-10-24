import { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ReTitle } from 're-title';
import { FaCarAlt, FaMoneyBillWave, FaUserCog, FaStar, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaBars, FaHome, FaCar, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { BsCalendarCheck } from 'react-icons/bs';
import { FiCalendar, FiDollarSign, FiFilter } from 'react-icons/fi';
import { Link } from 'react-router';
import { AuthContext } from '../../Provider/AuthProvider';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const CarOwnerDashboard = () => {
    const [activeTab, setActiveTab] = useState('myCars');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user } = useContext(AuthContext);

    // State for dynamic data
    const [myCars, setMyCars] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [earnings, setEarnings] = useState({
        totalEarnings: "$0",
        pendingPayout: "$0",
        completedPayouts: "$0",
        recentTransactions: []
    });
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Edit car state
    const [editingCar, setEditingCar] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortOption, setSortOption] = useState('date-newest');

    // Fetch car owner's data
    useEffect(() => {
        if (user?.email) {
            fetchCarOwnerData();
        }
    }, [user, sortOption]);

    const fetchCarOwnerData = async () => {
        try {
            setLoading(true);

            // Fetch cars owned by this user
            const carsResponse = await fetch(`https://rentizo-server.vercel.app/cars/by-email?email=${user.email}`, {
                credentials: 'include',
            });

            if (carsResponse.ok) {
                const carsData = await carsResponse.json();
                
                // Sort cars based on sortOption
                let sortedData = [...carsData];
                if (sortOption === 'date-newest') {
                    sortedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                } else if (sortOption === 'date-oldest') {
                    sortedData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                } else if (sortOption === 'price-lowest') {
                    sortedData.sort((a, b) => a.pricePerDay - b.pricePerDay);
                } else if (sortOption === 'price-highest') {
                    sortedData.sort((a, b) => b.pricePerDay - a.pricePerDay);
                }

                setMyCars(sortedData.map(car => ({
                    ...car,
                    id: car._id,
                    model: car.carModel || `${car.make} ${car.model} ${car.year}`,
                    image: car.image,
                    price: `$${car.pricePerDay}/day`,
                    status: car.availability || 'available',
                    rating: car.rating || 4.5,
                    trips: car.bookingCount || 0
                })));

                // Fetch bookings for owner's cars using the new endpoint
                const bookingsResponse = await fetch(`https://rentizo-server.vercel.app/bookings/owner?email=${user.email}`, {
                    credentials: 'include',
                });

                if (bookingsResponse.ok) {
                    const ownerBookings = await bookingsResponse.json();
                    
                    setBookings(ownerBookings.map(booking => ({
                        id: booking._id,
                        carId: booking.carId,
                        car: booking.carModel || 'Car',
                        image: booking.carImage || '/default-car.jpg',
                        user: booking.userName || 'Customer',
                        userEmail: booking.userEmail,
                        dates: `${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}`,
                        startDate: booking.startDate,
                        endDate: booking.endDate,
                        price: `$${booking.totalPrice || booking.pricePerDay * 5}`,
                        totalPrice: booking.totalPrice,
                        status: booking.status || 'pending',
                        createdAt: booking.createdAt
                    })));
                } else {
                    console.log('No bookings found or access denied');
                    setBookings([]);
                }
            } else {
                console.error('Failed to fetch cars');
                setMyCars([]);
            }

            // Calculate earnings based on payments
            const earningsResponse = await fetch(`https://rentizo-server.vercel.app/payments?email=${user.email}`, {
                credentials: 'include',
            });

            if (earningsResponse.ok) {
                const paymentsData = await earningsResponse.json();
                
                const total = paymentsData.reduce((sum, payment) => sum + parseInt(payment.amount || 0), 0);
                const pending = paymentsData.filter(p => p.status === 'pending').reduce((sum, p) => sum + parseInt(p.amount || 0), 0);
                const completed = paymentsData.filter(p => p.status === 'completed').reduce((sum, p) => sum + parseInt(p.amount || 0), 0);

                setEarnings({
                    totalEarnings: `$${total}`,
                    pendingPayout: `$${pending}`,
                    completedPayouts: `$${completed}`,
                    recentTransactions: paymentsData.slice(0, 5).map(payment => ({
                        id: payment._id,
                        date: new Date(payment.createdAt).toLocaleDateString(),
                        amount: `$${payment.amount}`,
                        status: payment.status
                    }))
                });
            }

            // Sample reviews (you can replace with actual API call)
            setReviews([
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
            ]);

        } catch (error) {
            console.error('Error fetching car owner data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    // Handle update car
    const handleUpdate = async (e) => {
        e.preventDefault();
        const form = e.target;

        const updatedCar = {
            carModel: form.carModel.value,
            pricePerDay: parseFloat(form.pricePerDay.value),
            availability: form.availability.value,
            registration: form.registration.value,
            features: form.features.value.split(',').map(f => f.trim()),
            description: form.description.value,
            image: form.image.value,
            location: form.location.value,
        };

        const result = await Swal.fire({
            title: "Save Changes?",
            text: "Are you sure you want to update this car listing?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Save Changes",
            cancelButtonText: "Cancel",
            reverseButtons: true,
            customClass: {
                confirmButton: 'bg-primary hover:bg-primary-dark',
                cancelButton: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`https://rentizo-server.vercel.app/cars/${editingCar._id}?email=${user?.email}`, {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedCar),
                });

                if (res.ok) {
                    toast.success('Car updated successfully!');
                    setMyCars((prev) =>
                        prev.map((car) => (car._id === editingCar._id ? { ...car, ...updatedCar } : car))
                    );
                    setIsModalOpen(false);
                    setEditingCar(null);
                } else {
                    throw new Error('Update failed');
                }
            } catch {
                toast.error('Failed to update car');
            }
        }
    };

    // Handle delete car
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Delete Car?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            customClass: {
                confirmButton: 'bg-red-600 hover:bg-red-700',
                cancelButton: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`https://rentizo-server.vercel.app/cars/${id}?email=${user?.email}`, {
                        method: 'DELETE',
                        credentials: 'include',
                    });
                    if (res.ok) {
                        setMyCars((prev) => prev.filter((car) => car._id !== id));
                        toast.success('Car deleted successfully!');
                    } else {
                        throw new Error();
                    }
                } catch {
                    toast.error('Failed to delete car');
                }
            }
        });
    };

    const tabs = [
        { id: 'myCars', label: 'My Cars', icon: <FaCarAlt /> },
        { id: 'bookings', label: 'Bookings', icon: <BsCalendarCheck /> },
        { id: 'earnings', label: 'Earnings', icon: <FaMoneyBillWave /> },
        { id: 'reviews', label: 'Reviews', icon: <FaStar /> },
        { id: 'profile', label: 'Settings', icon: <FaUserCog /> }
    ];

    const renderTabContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            );
        }

        switch (activeTab) {
            case 'myCars':
                return (
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold">My Car Listings</h2>
                                <p className="text-gray-400">
                                    Manage your {myCars.length} listed {myCars.length === 1 ? 'vehicle' : 'vehicles'}
                                </p>
                            </div>

                            <div className="flex gap-3 w-full md:w-auto">
                                <div className="relative">
                                    <select
                                        value={sortOption}
                                        onChange={(e) => setSortOption(e.target.value)}
                                        className="appearance-none bg-gray-800 border border-gray-700 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                                    >
                                        <option value="date-newest">Newest First</option>
                                        <option value="date-oldest">Oldest First</option>
                                        <option value="price-lowest">Price: Low to High</option>
                                        <option value="price-highest">Price: High to Low</option>
                                    </select>
                                    <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>

                                <Link
                                    to="/add-car"
                                    className="btn btn-primary rounded-lg px-4 py-2 flex items-center gap-2"
                                >
                                    <FaPlus /> Add New
                                </Link>
                            </div>
                        </div>

                        {myCars.length === 0 ? (
                            <div className="text-center py-12 bg-gray-900 rounded-xl">
                                <div className="bg-gray-800 p-8 rounded-2xl max-w-md w-full mx-auto">
                                    <FaCar className="text-5xl mx-auto text-primary mb-4" />
                                    <h2 className="text-2xl font-bold mb-4">No Cars Listed Yet</h2>
                                    <p className="text-gray-400 mb-6">
                                        You haven't added any cars to your profile. Start earning by listing your vehicle today!
                                    </p>
                                    <Link
                                        to="/add-car"
                                        className="btn btn-primary rounded-full px-6 py-3 flex items-center gap-2 w-fit mx-auto"
                                    >
                                        <FaPlus /> Add Your First Car
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myCars.map((car) => (
                                    <motion.div
                                        key={car._id}
                                        whileHover={{ y: -5 }}
                                        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 overflow-hidden hover:border-primary transition-all"
                                    >
                                        <div className="relative h-48">
                                            <img
                                                src={car.image || '/default-car.jpg'}
                                                alt={car.carModel}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = '/default-car.jpg';
                                                }}
                                            />
                                            <div className="absolute top-3 right-3 flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingCar(car);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="p-2 bg-gray-800 rounded-full shadow-md hover:bg-gray-700 transition-colors"
                                                    aria-label="Edit car"
                                                >
                                                    <FaEdit className="text-primary" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(car._id)}
                                                    className="p-2 bg-gray-800 rounded-full shadow-md hover:bg-gray-700 transition-colors"
                                                    aria-label="Delete car"
                                                >
                                                    <FaTrash className="text-red-500" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold text-white truncate">
                                                    {car.carModel}
                                                </h3>
                                                <span className="bg-primary bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                    ${car.pricePerDay}/day
                                                </span>
                                            </div>

                                            <div className="flex items-center text-sm text-gray-400 mb-3">
                                                <FaCar className="mr-1" />
                                                <span className="mr-3">{car.registration}</span>
                                                {car.availability?.toLowerCase() === 'available' ? (
                                                    <span className="flex items-center text-green-400">
                                                        <FaCheckCircle className="mr-1" /> Available
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center text-red-400">
                                                        <FaTimesCircle className="mr-1" /> Unavailable
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {car.features?.slice(0, 3).map((feature, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-gray-700 text-gray-200 text-xs px-2 py-1 rounded"
                                                    >
                                                        {feature}
                                                    </span>
                                                ))}
                                                {car.features?.length > 3 && (
                                                    <span className="bg-gray-700 text-gray-200 text-xs px-2 py-1 rounded">
                                                        +{car.features.length - 3} more
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                                                <div className="text-sm text-gray-400 flex items-center">
                                                    <FiCalendar className="mr-1" />
                                                    {new Date(car.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="text-sm font-medium">
                                                    <span className="text-primary">{car.bookingCount || 0}</span> bookings
                                                </div>
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
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Bookings Received</h2>
                            <span className="text-gray-400">
                                {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
                            </span>
                        </div>

                        {bookings.length === 0 ? (
                            <div className="text-center py-12 bg-gray-900 rounded-xl">
                                <BsCalendarCheck className="text-5xl mx-auto text-gray-600 mb-4" />
                                <h3 className="text-xl font-bold mb-2">No Bookings Yet</h3>
                                <p className="text-gray-400">You haven't received any bookings for your cars yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {bookings.map(booking => (
                                    <motion.div
                                        key={booking.carId}
                                        whileHover={{ scale: 1.01 }}
                                        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 overflow-hidden"
                                    >
                                        <div className="flex flex-col md:flex-row">
                                            <div className="p-6 w-full">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-xl font-bold">{booking.car}</h3>
                                                        <p className="text-gray-400">Booked by: {booking.user}</p>
                                                        <p className="text-gray-400 text-sm">{booking.userEmail}</p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        booking.status === 'confirmed' ? 'bg-green-900 text-green-300' :
                                                        booking.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                                                        booking.status === 'rejected' ? 'bg-red-900 text-red-300' :
                                                        'bg-gray-700 text-gray-300'
                                                    }`}>
                                                        {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                                                    </span>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <p className="text-gray-400 text-sm">Booking Dates</p>
                                                        <p className="font-medium">{booking.dates}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-400 text-sm">Total Amount</p>
                                                        <p className="text-primary font-bold">{booking.price}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-400 text-sm">Start Date</p>
                                                        <p>{new Date(booking.startDate).toLocaleDateString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-400 text-sm">End Date</p>
                                                        <p>{new Date(booking.endDate).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
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
                            {earnings.recentTransactions.length === 0 ? (
                                <p className="text-gray-400 text-center py-4">No transactions yet</p>
                            ) : (
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
                                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                                            transaction.status === 'completed' ? 'bg-green-900 text-green-300' : 
                                                            'bg-yellow-900 text-yellow-300'
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
                            )}
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
                                <FaStar className="text-5xl mx-auto text-gray-600 mb-4" />
                                <h3 className="text-xl font-bold mb-2">No Reviews Yet</h3>
                                <p className="text-gray-400">You haven't received any reviews from customers yet.</p>
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
                                        defaultValue={user?.displayName || "Car Owner"}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">Email</label>
                                    <input
                                        type="email"
                                        defaultValue={user?.email || "owner@example.com"}
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
            <ReTitle title="Owner Dashboard" />
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
                    <div className="hidden md:block w-64 flex-shrink-0">
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6 sticky top-8">
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                                    {user?.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt="Profile"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xl font-bold text-white">
                                            {user?.displayName?.charAt(0) || 'CO'}
                                        </span>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-bold text-white truncate">{user?.displayName || 'Car Owner'}</h3>
                                    <p className="text-sm text-gray-400 truncate">{user?.email}</p>
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
                                        <span className="whitespace-nowrap">{tab.label}</span>
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
                                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                                        {user?.photoURL ? (
                                            <img
                                                src={user.photoURL}
                                                alt="Profile"
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xl font-bold text-white">
                                                {user?.displayName?.charAt(0) || 'CO'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-white truncate">{user?.displayName || 'Car Owner'}</h3>
                                        <p className="text-sm text-gray-400 truncate">{user?.email}</p>
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
                                            <span className="whitespace-nowrap">{tab.label}</span>
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
                            {renderTabContent()}
                        </div>
                    </div>
                </div>

                {/* Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-bold text-white">Edit Car Details</h3>
                                    <button
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            setEditingCar(null);
                                        }}
                                        className="text-gray-400 hover:text-gray-200"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                Car Model
                                            </label>
                                            <input
                                                name="carModel"
                                                defaultValue={editingCar.carModel}
                                                required
                                                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-gray-700 text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                Price Per Day ($)
                                            </label>
                                            <input
                                                name="pricePerDay"
                                                defaultValue={editingCar.pricePerDay}
                                                required
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-gray-700 text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                Availability
                                            </label>
                                            <select
                                                name="availability"
                                                defaultValue={editingCar.availability}
                                                required
                                                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-gray-700 text-white"
                                            >
                                                <option value="available">Available</option>
                                                <option value="unavailable">Unavailable</option>
                                                <option value="maintenance">Under Maintenance</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                Registration Number
                                            </label>
                                            <input
                                                name="registration"
                                                defaultValue={editingCar.registration}
                                                required
                                                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-gray-700 text-white"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                Features (comma separated)
                                            </label>
                                            <input
                                                name="features"
                                                defaultValue={editingCar.features?.join(', ')}
                                                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-gray-700 text-white"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                Image URL
                                            </label>
                                            <input
                                                name="image"
                                                defaultValue={editingCar.image}
                                                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-gray-700 text-white"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                Location
                                            </label>
                                            <input
                                                name="location"
                                                defaultValue={editingCar.location}
                                                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-gray-700 text-white"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                Description
                                            </label>
                                            <textarea
                                                name="description"
                                                defaultValue={editingCar.description}
                                                rows="3"
                                                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-gray-700 text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsModalOpen(false);
                                                setEditingCar(null);
                                            }}
                                            className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CarOwnerDashboard;