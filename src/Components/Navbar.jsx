import { Link, NavLink } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { FaCar, FaSignOutAlt } from 'react-icons/fa';
import { useState } from 'react';
import ThemeToggle from '../Utils/ThemeToggle';

// Framer Motion variant for list container (optional)
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
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Replace with real auth
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = isLoggedIn
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
            { name: 'Log In', path: '/login' },
        ];

    return (
        <div className="bg-base-100 shadow-md sticky top-0 z-50">
            <div className="navbar max-w-7xl mx-auto px-4">
                {/* Mobile Menu Button */}
                <div className="lg:hidden mr-3">
                    <label className="btn btn-circle swap swap-rotate" aria-label="Toggle navigation menu">
                        <input type="checkbox" onChange={() => setIsMenuOpen(!isMenuOpen)} checked={isMenuOpen} />

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
                {/* Logo */}
                <div className="flex-1">
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
                <div className='lg:hidden'>
                    <ThemeToggle></ThemeToggle>
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex gap-6 items-center">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `text-base font-medium ${isActive ? 'text-primary underline' : 'text-gray-700 hover:text-primary'
                                }`
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
                    <ThemeToggle></ThemeToggle>
                    <div>
                        {isLoggedIn && (
                            <button
                                className="btn btn-sm btn-outline text-error"
                                onClick={() => setIsLoggedIn(false)}
                            >
                                <FaSignOutAlt className="mr-1" /> Logout
                            </button>
                        )}
                    </div>
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
                        className="lg:hidden px-4 pb-4"
                    >
                        <motion.ul
                            className="menu bg-base-100 rounded-box shadow w-full space-y-2 mt-2"
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
                                            isActive ? 'text-primary font-semibold' : 'hover:text-primary'
                                        }
                                    >
                                        {item.name}
                                    </NavLink>
                                </motion.li>
                            ))}
                            {isLoggedIn && (
                                <motion.li variants={itemVariants}>
                                    <button
                                        onClick={() => {
                                            setIsLoggedIn(false);
                                            setIsMenuOpen(false);
                                        }}
                                        className="text-error"
                                    >
                                        <FaSignOutAlt className="inline mr-1" /> Logout
                                    </button>
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
