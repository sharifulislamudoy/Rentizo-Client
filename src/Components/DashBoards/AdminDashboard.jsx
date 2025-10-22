import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ReTitle } from 're-title';
import { FaUsers, FaCar, FaCalendarAlt, FaChartLine, FaCog, FaComments, FaSearch, FaUserSlash, FaUserCheck, FaCheckCircle, FaTimesCircle, FaEdit, FaTrash, FaBars, FaStar, FaTimes } from 'react-icons/fa';
import { MdDashboard, MdAdminPanelSettings } from 'react-icons/md';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [cars, setCars] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, userId: null, userName: '' });

    // Fetch data based on active tab
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:3000/admin/${activeTab}`, {
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                
                const data = await response.json();
                
                switch (activeTab) {
                    case 'users':
                        setUsers(data);
                        break;
                    case 'cars':
                        setCars(data);
                        break;
                    case 'bookings':
                        setBookings(data);
                        break;
                    default:
                        break;
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (activeTab !== 'analytics' && activeTab !== 'settings') {
            fetchData();
        }
    }, [activeTab]);

    // Fetch stats for analytics
    useEffect(() => {
        const fetchStats = async () => {
            if (activeTab === 'analytics') {
                try {
                    const response = await fetch('http://localhost:3000/admin/stats', {
                        credentials: 'include'
                    });
                    
                    if (!response.ok) {
                        throw new Error('Failed to fetch stats');
                    }
                    
                    const data = await response.json();
                    setStats(data);
                } catch (error) {
                    console.error('Error fetching stats:', error);
                }
            }
        };

        fetchStats();
    }, [activeTab]);

    // Update user role
    const updateUserRole = async (userId, newRole) => {
        try {
            const response = await fetch(`http://localhost:3000/admin/users/${userId}/role`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ role: newRole })
            });

            if (!response.ok) {
                throw new Error('Failed to update user role');
            }

            // Update local state
            setUsers(users.map(user => 
                user._id === userId ? { ...user, role: newRole } : user
            ));

            alert('User role updated successfully!');
        } catch (error) {
            console.error('Error updating user role:', error);
            alert('Failed to update user role');
        }
    };


    // Delete user
    const deleteUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3000/admin/users/${userId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            // Remove user from local state
            setUsers(users.filter(user => user._id !== userId));
            
            // Hide confirmation dialog
            setDeleteConfirm({ show: false, userId: null, userName: '' });
            
            alert('User deleted successfully!');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    // Show delete confirmation
    const showDeleteConfirmation = (userId, userName) => {
        setDeleteConfirm({ 
            show: true, 
            userId, 
            userName 
        });
    };

    // Hide delete confirmation
    const hideDeleteConfirmation = () => {
        setDeleteConfirm({ show: false, userId: null, userName: '' });
    };

    // Update car status
    const updateCarStatus = async (carId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:3000/admin/cars/${carId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to update car status');
            }

            // Update local state
            setCars(cars.map(car => 
                car._id === carId ? { ...car, status: newStatus } : car
            ));

            alert('Car status updated successfully!');
        } catch (error) {
            console.error('Error updating car status:', error);
            alert('Failed to update car status');
        }
    };

    // Filter data based on search query
    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredCars = cars.filter(car => 
        car.model?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        car.addedBy?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredBookings = bookings.filter(booking => 
        booking.carModel?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        booking.userEmail?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Analytics data (you can replace this with real data from backend)
    const bookingData = [
        { name: 'Jan', completed: 120, upcoming: 80, cancelled: 10 },
        { name: 'Feb', completed: 98, upcoming: 70, cancelled: 8 },
        { name: 'Mar', completed: 150, upcoming: 90, cancelled: 12 },
        { name: 'Apr', completed: 110, upcoming: 60, cancelled: 5 },
        { name: 'May', completed: 140, upcoming: 100, cancelled: 15 },
        { name: 'Jun', completed: 180, upcoming: 120, cancelled: 20 },
    ];

    const carStatusData = [
        { name: 'Approved', value: cars.filter(car => car.status === 'approved').length },
        { name: 'Pending', value: cars.filter(car => car.status === 'pending').length },
        { name: 'Rejected', value: cars.filter(car => car.status === 'rejected').length },
    ];

    const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

    const tabs = [
        { id: 'users', label: 'User', icon: <FaUsers /> },
        { id: 'cars', label: 'Car', icon: <FaCar /> },
        { id: 'bookings', label: 'Bookings', icon: <FaCalendarAlt /> },
        { id: 'analytics', label: 'Reports', icon: <FaChartLine /> },
        { id: 'settings', label: 'Settings', icon: <FaCog /> }
    ];

    const renderTabContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            );
        }

        switch (activeTab) {
            case 'users':
                return (
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <h2 className="text-2xl font-bold">User Management</h2>
                            <div className="relative w-full md:w-64">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Joined</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {filteredUsers.map(user => (
                                            <tr key={user._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => updateUserRole(user._id, e.target.value)}
                                                        className={`px-2 py-1 rounded-full text-xs border-none outline-none ${
                                                            user.role === 'admin' ? 'bg-red-900 text-red-300' : 
                                                            user.role === 'car-owner' ? 'bg-purple-900 text-purple-300' : 
                                                            'bg-blue-900 text-blue-300'
                                                        }`}
                                                    >
                                                        <option value="user">User</option>
                                                        <option value="car-owner">Car Owner</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                                    <button 
                                                        onClick={() => showDeleteConfirmation(user._id, user.name)}
                                                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-xs flex items-center space-x-1"
                                                    >
                                                        <FaTrash size={12} /> <span>Delete</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case 'cars':
                return (
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <h2 className="text-2xl font-bold">Car Management</h2>
                            <div className="relative w-full md:w-64">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search cars..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Car Model</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Owner</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Price</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Submitted</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {filteredCars.map(car => (
                                            <tr key={car._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{car.carModel}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{car.addedBy?.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">${car.pricePerDay}/day</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {new Date(car.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                                    {car.status === 'pending' && (
                                                        <>
                                                            <button 
                                                                onClick={() => updateCarStatus(car._id, 'approved')}
                                                                className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-xs flex items-center space-x-1"
                                                            >
                                                                <FaCheckCircle size={12} /> <span>Approve</span>
                                                            </button>
                                                            <button 
                                                                onClick={() => updateCarStatus(car._id, 'rejected')}
                                                                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-xs flex items-center space-x-1"
                                                            >
                                                                <FaTimesCircle size={12} /> <span>Reject</span>
                                                            </button>
                                                        </>
                                                    )}
                                                    <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs">
                                                        <Link to={`/car-details/${car._id}`}>
                                                        View
                                                        </Link>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case 'bookings':
                return (
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <h2 className="text-2xl font-bold">Booking Management</h2>
                            <div className="relative w-full md:w-64">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search bookings..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Car</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Dates</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Price</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {filteredBookings.map(booking => (
                                            <tr key={booking._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{booking.carModel}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{booking.userEmail}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-primary">${booking.totalPrice}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                        booking.status === 'completed' ? 'bg-green-900 text-green-300' : 
                                                        booking.status === 'confirmed' ? 'bg-blue-900 text-blue-300' : 
                                                        'bg-red-900 text-red-300'
                                                    }`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                                    <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs">
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case 'analytics':
                return (
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
                                <h3 className="text-gray-400 mb-2">Total Users</h3>
                                <p className="text-3xl font-bold text-blue-400">{stats.totalUsers || 0}</p>
                            </div>
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
                                <h3 className="text-gray-400 mb-2">Total Owners</h3>
                                <p className="text-3xl font-bold text-purple-400">{stats.totalOwners || 0}</p>
                            </div>
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
                                <h3 className="text-gray-400 mb-2">Total Cars</h3>
                                <p className="text-3xl font-bold text-green-400">{stats.totalCars || 0}</p>
                            </div>
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
                                <h3 className="text-gray-400 mb-2">Total Bookings</h3>
                                <p className="text-3xl font-bold text-primary">{stats.totalBookings || 0}</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
                                <h3 className="text-xl font-bold mb-4">Monthly Bookings</h3>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={bookingData}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis dataKey="name" stroke="#9CA3AF" />
                                            <YAxis stroke="#9CA3AF" />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                                            />
                                            <Legend />
                                            <Bar dataKey="completed" fill="#00C49F" name="Completed" />
                                            <Bar dataKey="upcoming" fill="#0088FE" name="Upcoming" />
                                            <Bar dataKey="cancelled" fill="#FF8042" name="Cancelled" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
                                <h3 className="text-xl font-bold mb-4">Car Approval Status</h3>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={carStatusData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {carStatusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                                            />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">Revenue Overview</h3>
                                <div className="flex items-center space-x-2">
                                    <span className="text-green-400">{stats.monthlyGrowth || '+0%'}</span>
                                    <span className="text-gray-400">this month</span>
                                </div>
                            </div>
                            <div className="text-4xl font-bold text-primary">{stats.totalRevenue || '$0'}</div>
                            <p className="text-gray-400 mt-2">Total revenue generated from bookings</p>
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Site Settings</h2>
                        
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
                            <h3 className="text-xl font-bold mb-6">General Settings</h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-gray-400 mb-2">Site Name</label>
                                    <input 
                                        type="text" 
                                        defaultValue="Rentizo" 
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-gray-400 mb-2">Site Logo</label>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                                            <span className="text-gray-400">Logo</span>
                                        </div>
                                        <button className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg transition">
                                            Upload New Logo
                                        </button>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-gray-400 mb-2">Default Commission Rate</label>
                                    <div className="relative w-32">
                                        <input 
                                            type="number" 
                                            defaultValue="15" 
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2">%</span>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-gray-400 mb-2">Site Maintenance Mode</label>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input type="checkbox" value="" className="sr-only peer" />
                                        <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        <span className="ml-3 text-sm">Enable Maintenance Mode</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6">
                            <h3 className="text-xl font-bold mb-6">Notification Settings</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">New Booking Notifications</h4>
                                        <p className="text-sm text-gray-400">Receive notifications when new bookings are made</p>
                                    </div>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked className="sr-only peer" />
                                        <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">New User Notifications</h4>
                                        <p className="text-sm text-gray-400">Receive notifications when new users register</p>
                                    </div>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked className="sr-only peer" />
                                        <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">Payment Notifications</h4>
                                        <p className="text-sm text-gray-400">Receive notifications for completed payments</p>
                                    </div>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked className="sr-only peer" />
                                        <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-end">
                            <button className="px-6 py-3 bg-primary hover:bg-primary-dark rounded-lg transition">
                                Save Settings
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
            <ReTitle title="Rentizo | Admin Dashboard" />
            
            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4 text-red-400">Confirm Deletion</h3>
                        <p className="text-gray-300 mb-6">
                            Are you sure you want to delete user <strong>"{deleteConfirm.userName}"</strong>? 
                            This action cannot be undone and all associated data will be permanently removed.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={hideDeleteConfirmation}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteUser(deleteConfirm.userId)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition flex items-center space-x-2"
                            >
                                <FaTrash size={14} />
                                <span>Delete User</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-11/12 mx-auto">
                {/* Mobile menu button */}
                <div className="md:hidden flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Admin Dashboard
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
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-6 sticky inset-0 top-8">
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                                    <MdAdminPanelSettings size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold">Admin</h3>
                                </div>
                            </div>
                            <nav className="space-y-2">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                                            activeTab === tab.id 
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
                        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-90 p-6 overflow-y-auto">
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
                                        <MdAdminPanelSettings size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Admin</h3>
                                    </div>
                                </div>
                                <nav className="space-y-2">
                                    {tabs.map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => {
                                                setActiveTab(tab.id);
                                                setMobileMenuOpen(false);
                                            }}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                                                activeTab === tab.id 
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

export default AdminDashboard;