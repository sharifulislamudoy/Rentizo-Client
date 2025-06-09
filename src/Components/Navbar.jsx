import { Link, NavLink } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { FaCar, FaSignOutAlt } from 'react-icons/fa';
import { useContext, useState } from 'react';
import ThemeToggle from '../Utils/ThemeToggle';
import { AuthContext } from '../Provider/AuthProvider';
import Swal from 'sweetalert2';

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

    // const handleLogout = async () => {
    //     const result = await Swal.fire({
    //         title: 'Are you sure?',
    //         text: "You will be logged out!",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Yes, log out'
    //     });

    //     if (result.isConfirmed) {
    //         try {
    //             await logOut();
    //             Swal.fire('Logged out!', 'You have been logged out.', 'success');
    //         } catch (error) {
    //             console.error('Logout failed:', error);
    //             Swal.fire('Error', 'Logout failed. Please try again.', 'error');
    //         }
    //     }
    // };

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
                await logOut();
                Swal.fire('Logged out!', 'You have been logged out.', 'success');
                // Close drawers
                document.getElementById('my-drawer-4')?.click();
                document.getElementById('mobile-drawer')?.click();
            } catch (error) {
                console.error('Logout failed:', error);
                Swal.fire('Error', 'Logout failed. Please try again.', 'error');
            }
        }
    };



    return (
        <div className="backdrop-blur-md shadow-md sticky top-0 z-50">
            <div className="navbar lg:w-11/12 mx-auto px-4">
                {/* Mobile Menu Button */}
                <div className="lg:hidden mr-3">
                    <label className="btn btn-circle swap swap-rotate" aria-label="Toggle navigation menu" aria-expanded={isMenuOpen}>
                        <input type="checkbox" onChange={() => setIsMenuOpen(!isMenuOpen)} checked={isMenuOpen} />
                        <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512">
                            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
                        </svg>
                        <svg className="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512">
                            <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 
                                222.51 256 112 366.51 145.49 400 256 289.49 
                                366.51 400 400 366.51 289.49 256 400 145.49" />
                        </svg>
                    </label>
                </div>

                {/* Left: Logo */}
                <div className="flex-1 flex items-center lg:flex-none">
                    <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
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

                {/* Right: Theme Toggle + Profile Image Drawer Button + Login/Logout */}
                <div className="hidden lg:flex items-center gap-4">
                    <ThemeToggle />
                    <div className="drawer drawer-end">
                        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                        <div className="drawer-content">
                            <label htmlFor="my-drawer-4" className="cursor-pointer">
                                <img
                                    src={user?.photoURL || 'https://i.ibb.co/rH6jYwH/default-user.png'}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full border-2 border-primary hover:scale-105 transition-transform"
                                />
                            </label>
                        </div>
                        <div className="drawer-side z-50">
                            <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                            <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 space-y-3">
                                {user ? (
                                    <>
                                        <li>
                                            <span><strong>Name:</strong> {user.displayName || 'N/A'}</span>
                                        </li>
                                        <li>
                                            <span><strong>Email:</strong> {user.email}</span>
                                        </li>
                                        <li>
                                            <button
                                                className="btn btn-error text-white"
                                                onClick={handleLogout}
                                            >
                                                <FaSignOutAlt className="mr-2" /> Logout
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li>
                                            <span className="text-center">You are not logged in</span>
                                        </li>
                                        <li>
                                            <Link
                                                to="/login"
                                                className="btn btn-primary text-white"
                                                onClick={() => document.getElementById('my-drawer-4')?.click()}
                                            >
                                                Login
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Mobile ThemeToggle and Drawer Image */}
                <div className="lg:hidden flex items-center gap-2">
                    <ThemeToggle />
                    <div className="drawer drawer-end">
                        <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />
                        <div className="drawer-content">
                            <label htmlFor="mobile-drawer" className="cursor-pointer">
                                <img
                                    src={user?.photoURL || 'https://i.ibb.co/rH6jYwH/default-user.png'}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full border-2 border-primary hover:scale-105 transition-transform"
                                />
                            </label>
                        </div>
                        <div className="drawer-side z-50">
                            <label htmlFor="mobile-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                            <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 space-y-3">
                                {user ? (
                                    <>
                                        <li>
                                            <span><strong>Name:</strong> {user.displayName || 'N/A'}</span>
                                        </li>
                                        <li>
                                            <span><strong>Email:</strong> {user.email}</span>
                                        </li>
                                        <li>
                                            <button
                                                className="btn btn-error text-white"
                                                onClick={handleLogout}
                                            >
                                                <FaSignOutAlt className="mr-2" /> Logout
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li>
                                            <span className="text-center">You are not logged in</span>
                                        </li>
                                        <li>
                                            <Link
                                                to="/login"
                                                className="btn btn-primary text-white"
                                                onClick={() => document.getElementById('mobile-drawer')?.click()}
                                            >
                                                Login
                                            </Link>

                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
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
                        className="absolute lg:hidden px-4 pb-4 backdrop-blur-sm bg-base-100/80 rounded-b-xl shadow w-full"
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
                        </motion.ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Navbar;
