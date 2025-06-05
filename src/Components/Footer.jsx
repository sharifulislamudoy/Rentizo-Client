import { FaFacebookF, FaTwitter, FaInstagram, FaGithub, FaCar, FaArrowUp } from 'react-icons/fa';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const Footer = () => {
    const [showTopBtn, setShowTopBtn] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowTopBtn(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: (i = 0) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.2,
                duration: 0.5,
                ease: 'easeOut'
            }
        })
    };

    return (
        <footer className="relative bg-base-200 text-base-content">
            <motion.div
                className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {/* Brand */}
                <motion.div custom={0} variants={fadeUp}>
                    <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary mb-4">
                        <FaCar className="text-3xl" />
                        Rentizo
                    </Link>
                    <p className="text-sm text-gray-500">
                        Rentizo is your trusted platform to rent, list, and book cars with ease. Experience seamless and reliable car rentals at your fingertips.
                    </p>
                </motion.div>

                {/* Quick Links */}
                <motion.div custom={1} variants={fadeUp}>
                    <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-primary">Home</Link></li>
                        <li><Link to="/available-cars" className="hover:text-primary">Available Cars</Link></li>
                        <li><Link to="/add-car" className="hover:text-primary">Add Car</Link></li>
                        <li><Link to="/my-cars" className="hover:text-primary">My Cars</Link></li>
                        <li><Link to="/my-bookings" className="hover:text-primary">My Bookings</Link></li>
                        <li><Link to="/login" className="hover:text-primary">Login</Link></li>
                    </ul>
                </motion.div>

                {/* Contact & Social */}
                <motion.div custom={2} variants={fadeUp}>
                    <h3 className="text-lg font-semibold mb-3">Connect With Us</h3>
                    <p className="text-sm text-gray-500 mb-4">Stay in touch through our social platforms.</p>
                    <div className="flex gap-4">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-primary"><FaFacebookF size={20} /></a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-primary"><FaTwitter size={20} /></a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-primary"><FaInstagram size={20} /></a>
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-primary"><FaGithub size={20} /></a>
                    </div>
                </motion.div>
            </motion.div>

            {/* Divider and Copyright */}
            <div className="border-t border-base-300 py-4 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Rentizo. All rights reserved.
            </div>

            {/* Scroll to Top Button */}
            {showTopBtn && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-5 right-5 p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary-focus transition-all"
                    aria-label="Scroll to top"
                >
                    <FaArrowUp size={16} />
                </button>
            )}
        </footer>
    );
};

export default Footer;
