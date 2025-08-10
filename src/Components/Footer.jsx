import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaCar, FaArrowUp } from 'react-icons/fa';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Footer = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = () => {
        if (isProcessing || subscribed) return;
        setIsProcessing(true);

        // Simulate API call delay
        setTimeout(() => {
            setIsProcessing(false);
            setSubscribed(true);
            // Reset to default after a few seconds
            setTimeout(() => setSubscribed(false), 3000);
        }, 2000);
    };
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const socialLinks = [
        { icon: <FaFacebookF />, url: "https://www.facebook.com/sharifulislamudoy56/" },
        { icon: <FaTwitter />, url: "https://x.com/MohonaAkte56859" },
        { icon: <FaInstagram />, url: "https://www.instagram.com/s_h_a_r_i_f_u_l_1039/" },
        { icon: <FaLinkedinIn />, url: "https://www.linkedin.com/in/shariful-islam-udoy" }
    ];

    const quickLinks = [
        { name: "Home", path: "/" },
        { name: "Available Cars", path: "/available-cars" },
        { name: "About Us", path: "/about-us" },
        { name: "Contact Us", path: "/contact-us" },
        { name: "Blog", path: "/blog" },
        { name: "FAQ", path: "/faq" },
    ];

    return (
        <motion.footer
            className="bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-16 pb-8 relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
        >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-primary opacity-10 blur-3xl"></div>
            <div className="absolute -bottom-40 left-0 w-64 h-64 rounded-full bg-secondary opacity-10 blur-3xl"></div>

            <div className="container mx-auto px-6">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {/* Brand Column */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
                            <FaCar className="text-3xl text-primary" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                Rentizo
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Revolutionizing car rentals with seamless digital experiences. We connect car owners with renters through our trusted platform.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 rounded-full bg-gray-800 hover:bg-primary transition-all duration-300 text-gray-300 hover:text-white"
                                    whileHover={{ y: -3 }}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links Column */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Quick Links</h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link, index) => (
                                <motion.li key={index} whileHover={{ x: 5 }}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm flex items-center"
                                    >
                                        <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                                        {link.name}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Column */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Contact Us</h3>
                        <div className="space-y-3 text-gray-400 text-sm">
                            <p>123 Rental Street</p>
                            <p>Car City, CC 10001</p>
                            <p>Email: info@rentizo.com</p>
                            <p>Phone: (123) 456-7890</p>
                        </div>
                    </motion.div>

                    {/* Newsletter Column */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Newsletter</h3>
                        <p className="text-gray-400 text-sm">
                            Subscribe to get updates on new vehicles and special offers.
                        </p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="px-4 py-2 bg-gray-800 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary w-full text-sm"
                                disabled={isProcessing || subscribed}
                            />
                            <button
                                onClick={handleSubscribe}
                                className="bg-gradient-to-r from-primary to-secondary px-4 py-2 rounded-r-md text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isProcessing || subscribed}
                            >
                                {isProcessing ? "Processing..." : subscribed ? "Thank you!" : "Subscribe"}
                            </button>
                        </div>
                    </motion.div>

                </motion.div>

                {/* Copyright Section */}
                <motion.div
                    className="pt-8 mt-8 border-t border-gray-800 text-center text-gray-500 text-sm"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <p>&copy; {currentYear} Rentizo. All rights reserved. | <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link> | <Link to="/terms" className="hover:text-primary">Terms of Service</Link></p>
                </motion.div>
            </div>

            {/* Scroll to Top Button */}
            <motion.button
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg flex items-center justify-center text-white z-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Scroll to top"
            >
                <FaArrowUp />
            </motion.button>
        </motion.footer>
    );
};

export default Footer;