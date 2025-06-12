import { motion } from 'framer-motion';
import carLoading from '../assets/carloading.json';
import Lottie from 'lottie-react';

// LoadingSpinner component shows an animated loading indicator using Lottie and framer-motion
const LoadingSpinner = () => {
    return (
        <motion.div
            // Center the content vertically and horizontally, with some spacing
            className="flex flex-col justify-center items-center min-h-screen space-y-4"
            initial={{ opacity: 0 }}   // Start transparent
            animate={{ opacity: 1 }}   // Fade in animation
        >
            <Lottie
                animationData={carLoading} // Lottie animation JSON file
                loop                       // Repeat the animation infinitely
                autoplay                   // Start playing automatically
                style={{ height: '300px', width: '400px' }} // Set animation size
            />
            {/* Informative text shown below the animation */}
            <p className="text-primary font-semibold text-2xl">
                Finding the perfect ride for you...
            </p>
        </motion.div>
    );
};

export default LoadingSpinner;
