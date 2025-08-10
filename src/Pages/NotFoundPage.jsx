import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { FaCar, FaExclamationTriangle } from 'react-icons/fa';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            <div className="w-full max-w-4xl">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col lg:flex-row rounded-xl overflow-hidden shadow-2xl bg-gray-900"
                >
                    {/* Left Side - Visual */}
                    <div className="lg:w-1/2 bg-gradient-to-br from-red-600 to-red-800 p-12 flex flex-col items-center justify-center text-center">
                        <motion.div
                            animate={{ 
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                            className="mb-8"
                        >
                            <FaExclamationTriangle className="text-8xl text-white opacity-90" />
                        </motion.div>
                        <h1 className="text-8xl font-bold text-white">404</h1>
                        <p className="text-xl text-white mt-4">Page Not Found</p>
                    </div>

                    {/* Right Side - Content */}
                    <div className="lg:w-1/2 p-12 flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            <div className="flex items-center mb-6">
                                <div className="p-3 rounded-full bg-gradient-to-br from-primary to-secondary mr-4">
                                    <FaCar className="text-xl text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                    Oops! You're off route.
                                </h2>
                            </div>

                            <p className="text-gray-300 mb-8">
                                The page you're looking for doesn't exist or has been moved. 
                                Don't worry though, we'll get you back on track.
                            </p>

                            <div className="space-y-4">
                                <motion.div
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Link 
                                        to="/"
                                        className="block w-full py-3 px-6 bg-gradient-to-r from-primary to-secondary rounded-lg font-medium text-center hover:opacity-90 transition-opacity"
                                    >
                                        Return Home
                                    </Link>
                                </motion.div>

                                <motion.div
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Link 
                                        to="/login"
                                        className="block w-full py-3 px-6 bg-gray-700 rounded-lg font-medium text-center hover:bg-gray-600 transition-colors"
                                    >
                                        Go to Login
                                    </Link>
                                </motion.div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-700">
                                <p className="text-gray-400 text-sm">
                                    Need help? <Link to="/contact" className="text-primary hover:underline">Contact support</Link>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFoundPage;