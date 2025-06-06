import { Link, NavLink } from 'react-router'; // Use 'react-router-dom' for React Router v6+
import { AnimatePresence, motion } from 'framer-motion';
import { FaCar, FaSignOutAlt } from 'react-icons/fa';
import { useContext, useState } from 'react';
import ThemeToggle from '../Utils/ThemeToggle';
import { AuthContext } from '../Provider/AuthProvider';

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
    const { user, logOut } = useContext(AuthContext);

    const navItems = user
        ? [
            { name: 'Home', path: '/' },
            { name: 'Available Cars', path: '/available-cars' },
            { name: 'Add Car', path: '/add-car' },
            { name: 'My Cars', path: '/my-cars' },
            { name: 'My Bookings', path: '/my-bookings' },
        ]
        : [
            { name: 'Home', path: '/' },
            { name: 'Available Cars', path: '/available-cars' },
        ];

    const handleLogout = async () => {
        try {
            await logOut();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="backdrop-blur-md shadow-md sticky top-0 z-50">
            <div className="navbar lg:w-11/12  mx-auto px-4">

                {/* Mobile Menu Button */}
                <div className="lg:hidden mr-3">
                    <label
                        className="btn btn-circle swap swap-rotate"
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMenuOpen}
                    >
                        <input
                            type="checkbox"
                            onChange={() => setIsMenuOpen(!isMenuOpen)}
                            checked={isMenuOpen}
                        />

                        {/* Hamburger icon */}
                        <svg
                            className="swap-off fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 512 512"
                        >
                            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
                        </svg>

                        {/* Close icon */}
                        <svg
                            className="swap-on fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 512 512"
                        >
                            <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 
              222.51 256 112 366.51 145.49 400 256 289.49 
              366.51 400 400 366.51 289.49 256 400 145.49" />
                        </svg>
                    </label>
                </div>

                {/* Left: Logo */}
                <div className="flex-1 flex items-center lg:flex-none">
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
                            <FaCar className="text-2xl" />
                            Rentizo
                        </Link>
                    </motion.div>
                </div>

                {/* Center: Nav Items for lg and up */}
                <div className="hidden lg:flex flex-1 justify-center gap-6 items-center">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `text-base font-medium transition-colors duration-300 ${isActive ? 'text-primary underline' : 'text-gray-700 hover:text-primary'
                                }`
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </div>

                {/* Right: Login/Logout and Theme Toggle */}
                <div className="hidden lg:flex items-center gap-4">
                    <ThemeToggle />
                    {user ? (
                        <button
                            className="btn btn-sm btn-outline text-error transition-all duration-300 hover:scale-105 flex items-center"
                            onClick={handleLogout}
                        >
                            <FaSignOutAlt className="mr-1" /> Logout
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="btn btn-sm btn-primary text-white hover:bg-primary-focus"
                        >
                            Log In
                        </Link>
                    )}
                </div>

                {/* Mobile ThemeToggle */}
                <div className="lg:hidden">
                    <ThemeToggle />
                </div>
            </div>

            {/* Mobile Dropdown */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="absolute lg:hidden px-4 pb-4 backdrop-blur-sm bg-base-100/80 rounded-b-xl shadow"
                    >
                        <motion.ul
                            className="menu rounded-box w-full space-y-2 mt-2"
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
                                            `block py-2 px-3 text-sm transition-colors duration-300 ${isActive ? 'text-primary font-semibold' : 'hover:text-primary'
                                            }`
                                        }
                                    >
                                        {item.name}
                                    </NavLink>
                                </motion.li>
                            ))}
                            {user ? (
                                <motion.li variants={itemVariants}>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="text-error hover:text-red-600 transition-all duration-300 flex items-center"
                                    >
                                        <FaSignOutAlt className="inline mr-1" /> Logout
                                    </button>
                                </motion.li>
                            ) : (
                                <motion.li variants={itemVariants}>
                                    <NavLink
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="hover:text-primary"
                                    >
                                        Log In
                                    </NavLink>
                                </motion.li>
                            )}
                        </motion.ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Navbar;
