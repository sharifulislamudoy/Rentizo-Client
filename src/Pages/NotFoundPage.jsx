import { motion } from 'framer-motion';
import { Link } from 'react-router';
import Lottie from 'lottie-react';
import errorAnimation from '../assets/error.json';

const ErrorPage = () => {
    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center bg-base-200 px-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-md w-full">
                <Lottie
                    animationData={errorAnimation}
                    loop
                    className="w-full max-w-xs mx-auto"
                />

                <motion.h1
                    className="text-4xl font-bold text-primary mb-4"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Oops! Page Not Found
                </motion.h1>

                <motion.p
                    className="text-gray-500 mb-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </motion.p>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <Link to="/" className="btn btn-primary">
                        Go Back Home
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ErrorPage;
