import { motion } from 'framer-motion';
import carLoading from '../assets/carloading.json';
import Lottie from 'lottie-react';

const LoadingSpinner = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const textVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const pulseVariants = {
        initial: { scale: 1 },
        pulse: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.div
            className="flex flex-col justify-center items-center min-h-screen bg-black"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                variants={pulseVariants}
                initial="initial"
                animate="pulse"
                className="mb-8"
            >
                <Lottie
                    animationData={carLoading}
                    loop
                    autoplay
                    style={{ height: '250px', width: '350px' }}
                />
            </motion.div>

            <motion.div
                variants={textVariants}
                className="text-center space-y-4"
            >
                <h2 className="text-3xl md:text-4xl font-bold">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        Finding Your Perfect Ride
                    </span>
                </h2>
                <div className="flex justify-center items-center space-x-2">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="h-2 w-2 bg-primary rounded-full"
                            animate={{
                                y: [0, -5, 0],
                                opacity: [0.6, 1, 0.6],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                        />
                    ))}
                </div>
                <p className="text-gray-300 max-w-md mx-auto">
                    Searching through our premium collection to match your needs...
                </p>
            </motion.div>

            <motion.div 
                className="mt-12 text-gray-500 text-sm"
                variants={textVariants}
            >
                <p>Rentizo - Luxury Redefined</p>
            </motion.div>
        </motion.div>
    );
};

export default LoadingSpinner;