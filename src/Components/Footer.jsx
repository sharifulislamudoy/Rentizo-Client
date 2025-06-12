import { FaFacebookF, FaTwitter, FaInstagram, FaGithub, FaCar, FaLongArrowAltUp } from 'react-icons/fa';
import { Link } from 'react-router'; // For client-side navigation
import { motion } from 'framer-motion'; // For animations
import { useContext } from 'react';
import { AuthContext } from '../Provider/AuthProvider'; // Auth context to check if user is logged in

const Footer = () => {
    // Function to smoothly scroll the page to the top when called
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Get the current logged-in user from AuthContext
    const { user } = useContext(AuthContext);

    // Animation variants for fading up elements with staggered delays
    const fadeUp = {
        hidden: { opacity: 0, y: 30 }, // Start invisible and moved down
        visible: (i = 0) => ({
            opacity: 1,
            y: 0, // Move to normal position
            transition: {
                delay: i * 0.2, // Delay increases per item for stagger effect
                duration: 0.5,
                ease: 'easeOut',
            },
        }),
    };

    return (
        <motion.footer
            initial={{ opacity: 0, y: 30 }}       // Initial animation for footer
            whileInView={{ opacity: 1, y: 0 }}    // Animate on entering viewport
            viewport={{ once: true }}              // Animate only once
            transition={{ duration: 0.5 }}
            className="bg-[#1E293B] text-white relative"
        >
            <motion.div
                className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}  // Animate every time the content is visible
            >
                {/* Brand section with logo and description */}
                <motion.div custom={0} variants={fadeUp}>
                    <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary mb-4">
                        <FaCar className="text-3xl" />
                        Rentizo
                    </Link>
                    <p className="text-sm text-gray-300">
                        Rentizo is your trusted platform to rent, list, and book cars with ease. Experience seamless and reliable car rentals at your fingertips.
                    </p>
                </motion.div>

                {/* Quick navigation links */}
                <motion.div custom={1} variants={fadeUp}>
                    <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-primary">Home</Link></li>
                        <li><Link to="/available-cars" className="hover:text-primary">Available Cars</Link></li>
                        <li><Link to="/add-car" className="hover:text-primary">Add Car</Link></li>
                        <li><Link to="/my-cars" className="hover:text-primary">My Cars</Link></li>
                        <li><Link to="/my-bookings" className="hover:text-primary">My Bookings</Link></li>
                        {/* Show login link only if user is not logged in */}
                        <li>{user ? '' : <Link to="/login" className="hover:text-primary">Login</Link>}</li>
                    </ul>
                </motion.div>

                {/* Social media and contact links */}
                <motion.div custom={2} variants={fadeUp}>
                    <h3 className="text-lg font-semibold mb-3">Connect With Us</h3>
                    <p className="text-sm text-gray-300 mb-4">Stay in touch through our social platforms.</p>
                    <div className="flex gap-4">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-primary">
                            <FaFacebookF size={20} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-primary">
                            <FaTwitter size={20} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-primary">
                            <FaInstagram size={20} />
                        </a>
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-primary">
                            <FaGithub size={20} />
                        </a>
                    </div>
                </motion.div>
            </motion.div>

            {/* Footer bottom area with copyright */}
            <div className="border-t border-base-300 py-4 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Rentizo. All rights reserved.
            </div>

            {/* Scroll to top button fixed at bottom right */}
            <motion.button
                whileHover={{ scale: 1.1 }}   // Slightly enlarge on hover
                whileTap={{ scale: 0.95 }}    // Slightly shrink on tap/click
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 btn btn-circle btn-primary shadow-lg"
                aria-label="Scroll to top"
            >
                <FaLongArrowAltUp />
            </motion.button>
        </motion.footer>
    );
};

export default Footer;
