import { Link, NavLink } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { FaCar, FaSignOutAlt, FaUserPlus, FaHistory, FaCog, FaHeart, FaStar, FaWallet } from 'react-icons/fa';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../Provider/AuthProvider';
import Swal from 'sweetalert2';
import axios from 'axios';

const listVariants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.07,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
};

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userRole, setUserRole] = useState('user');
    const { user, logOut } = useContext(AuthContext);

    // Fetch user role when user changes
    useEffect(() => {
        const fetchUserRole = async () => {
            if (user?.email) {
                try {
                    const response = await axios.get(`http://localhost:3000/users/${user.email}`);
                    setUserRole(response.data.role || 'user');
                } catch (error) {
                    console.error('Error fetching user role:', error);
                    setUserRole('user');
                }
            }
        };

        fetchUserRole();
    }, [user]);

    // Simplified navigation links (only public routes)
    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Available Cars', path: '/available-cars' },
        { name: 'About Us', path: '/about-us' },
        { name: 'Contact Us', path: '/contact-us' },
        { name: 'Blog', path: '/blog' },
        { name: 'FAQ', path: '/faq' },
    ];

    // Get dashboard path based on user role
    const getDashboardPath = () => {
        switch (userRole) {
            case 'admin':
                return '/admin/dashboard';
            case 'car-owner':
                return '/car-owner/dashboard';
            default:
                return '/user/dashboard';
        }
    };

    // User-specific links (will appear in drawer)
    const getUserLinks = () => {
        const baseLinks = [
            { name: 'Dashboard', path: getDashboardPath(), icon: <FaCar className="text-sm" /> },
            { name: 'My Bookings', path: '/my-bookings', icon: <FaHistory className="text-sm" /> },
        ];

        // Add car owner specific links
        if (userRole === 'car-owner') {
            baseLinks.splice(1, 0, 
                { name: 'Add Car', path: '/add-car', icon: <FaCar className="text-sm" /> },
                { name: 'My Cars', path: '/my-cars', icon: <FaCar className="text-sm" /> }
            );
        }

        return baseLinks;
    };

    const userLinks = user ? getUserLinks() : [];

    // Dummy user stats data
    const userStats = {
        bookings: userRole === 'car-owner' ? 24 : 5,
        favorites: 12,
        reviews: 8,
        memberSince: '2024'
    };

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, log out'
        });

        if (result.isConfirmed) {
            try {
                await axios.post('http://localhost:3000/logout', {}, { withCredentials: true });
                await logOut();
                setUserRole('user'); // Reset role on logout
                Swal.fire('Logged out!', 'You have been logged out.', 'success');
                document.getElementById('my-drawer-4')?.click();
                document.getElementById('mobile-drawer')?.click();
            } catch (error) {
                console.error('Logout failed:', error);
                Swal.fire('Error', 'Logout failed. Please try again.', 'error');
            }
        }
    };

    const DrawerContent = ({ isMobile = false }) => (
        <div className={`menu bg-black border-l-2 text-base-content min-h-full ${isMobile ? 'w-72' : 'w-80'} p-4 border-primary rounded-l-xl`}>
            {/* User Profile Section */}
            <div className="flex flex-col items-center py-4 border-b border-gray-700 mb-4">
                <div className="avatar mb-3">
                    <div className="w-16 rounded-full ring-2 ring-primary">
                        <img src={user?.photoURL || 'https://i.ibb.co/BVHW9x0W/Untitled-design-77.png'} alt="Profile" />
                    </div>
                </div>
                <h3 className="font-bold text-lg text-white">{user.displayName || 'User Name'}</h3>
                <p className="text-sm text-gray-400">{user.email}</p>
                <span className="badge badge-primary badge-sm mt-1 capitalize">{userRole}</span>
                
            </div>

            {/* Navigation Links */}
            <h4 className="text-sm font-semibold text-gray-400 mb-3">NAVIGATION</h4>
            <ul className="space-y-1 mb-6">
                {userLinks.map((item) => (
                    <li key={item.name}>
                        <Link 
                            to={item.path} 
                            className="flex items-center gap-3 hover:bg-gray-800 py-3 px-2 rounded-lg transition-colors"
                            onClick={() => isMobile && document.getElementById('mobile-drawer')?.click()}
                        >
                            {item.icon}
                            <span className="text-white">{item.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Support Section */}
            <div className="border-t border-gray-700 pt-4">
                <h4 className="text-sm font-semibold text-gray-400 mb-3">SUPPORT</h4>
                <div className="space-y-2 text-sm">
                    <a href="#" className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors">
                        <span>📞</span> 24/7 Support
                    </a>
                    <a href="#" className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors">
                        <span>📧</span> Contact Help
                    </a>
                </div>
            </div>

            {/* Logout Button */}
            <div className="border-t border-gray-700 pt-4 mt-4">
                <button
                    onClick={handleLogout}
                    className="btn btn-error btn-outline w-full gap-2"
                >
                    <FaSignOutAlt /> Logout
                </button>
            </div>

            {/* App Version */}
            <div className="text-center mt-6">
                <p className="text-xs text-gray-500">Rentizo v2.1.4</p>
            </div>
        </div>
    );

    return (
        <div className="shadow-sm sticky top-0 z-50 border-b-2 border-primary rounded-b-xl bg-black">
            <div className="navbar lg:w-11/12 mx-auto px-4">
                {/* Mobile menu toggle */}
                <div className="lg:hidden mr-3">
                    <label className="btn btn-ghost btn-circle swap swap-rotate" aria-label="Toggle navigation menu">
                        <input type="checkbox" onChange={() => setIsMenuOpen(!isMenuOpen)} checked={isMenuOpen} />
                        {/* Hamburger icon */}
                        <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512">
                            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
                        </svg>
                        {/* Close icon */}
                        <svg className="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512">
                            <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 
                                222.51 256 112 366.51 145.49 400 256 289.49 
                                366.51 400 400 366.51 289.49 256 400 145.49" />
                        </svg>
                    </label>
                </div>

                {/* Logo */}
                <div className="flex-1 flex items-center lg:flex-none ml-3">
                    <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
                            <FaCar className="text-2xl" />
                            <span className="hidden sm:inline">Rentizo</span>
                        </Link>
                    </motion.div>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex flex-1 justify-center gap-6 items-center">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-primary' : 'text-white hover:text-primary'}`
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </div>

                {/* Desktop Right Side */}
                <div className="hidden lg:flex items-center gap-4">
                    {user ? (
                        <div className="drawer drawer-end">
                            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                            <div className="drawer-content">
                                <label htmlFor="my-drawer-4" className="cursor-pointer">
                                    <div className="avatar">
                                        <div className="w-10 rounded-full ring-2 ring-primary hover:ring-offset-2 transition-all">
                                            <img src={user?.photoURL || 'https://i.ibb.co/BVHW9x0W/Untitled-design-77.png'} alt="Profile" />
                                        </div>
                                    </div>
                                </label>
                            </div>
                            <div className="drawer-side z-50">
                                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                                <DrawerContent />
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-2 mr-3">
                            <Link to="/login" className="btn btn-ghost btn-sm">
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-primary btn-sm">
                                <FaUserPlus className="mr-1" /> Join Us
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Right Side */}
                <div className="lg:hidden flex items-center gap-2">
                    {user ? (
                        <div className="drawer drawer-end">
                            <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />
                            <div className="drawer-content">
                                <label htmlFor="mobile-drawer" className="cursor-pointer">
                                    <div className="avatar">
                                        <div className="w-8 rounded-full ring-1 ring-primary">
                                            <img src={user?.photoURL || 'https://i.ibb.co/BVHW9x0W/Untitled-design-77.png'} alt="Profile" />
                                        </div>
                                    </div>
                                </label>
                            </div>
                            <div className="drawer-side z-50">
                                <label htmlFor="mobile-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                                <DrawerContent isMobile={true} />
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-ghost btn-sm px-2">
                            Login
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden px-4 pb-4 bg-black shadow-md w-full"
                    >
                        <motion.ul
                            className="menu rounded-box w-full space-y-1 mt-2"
                            variants={listVariants}
                            initial="initial"
                            animate="animate"
                        >
                            {navItems.map((item) => (
                                <motion.li key={item.name} variants={itemVariants}>
                                    <NavLink
                                        to={item.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `block py-2 px-3 text-sm ${isActive ? 'text-primary font-medium' : 'hover:bg-base-200'}`
                                        }
                                    >
                                        {item.name}
                                    </NavLink>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Navbar;