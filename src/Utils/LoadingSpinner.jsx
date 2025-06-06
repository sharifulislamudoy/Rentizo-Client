import { motion } from 'framer-motion';
import carLoading from '../assets/carloading.json';
import Lottie from 'lottie-react';

const LoadingSpinner = () => {
    return (
        <motion.div
            className="flex flex-col justify-center items-center min-h-screen space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <Lottie
                animationData={carLoading}
                loop
                autoplay
                style={{ height: '300px', width: '400px' }}
            />
            <p className="text-primary font-semibold text-2xl">Finding the perfect ride for you...</p>
        </motion.div>
    );
};

export default LoadingSpinner;
