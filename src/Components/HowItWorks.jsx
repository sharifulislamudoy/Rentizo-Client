import { motion } from 'framer-motion';
import { FaCarSide, FaSearch, FaCalendarAlt, FaCreditCard, FaKey } from 'react-icons/fa';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

const HowItWorks = () => {
    const steps = [
        {
            icon: <FaSearch className="text-3xl" />,
            title: "Search & Select",
            description: "Browse our extensive collection of vehicles and find the perfect match for your needs.",
            color: "from-blue-400 to-blue-600"
        },
        {
            icon: <FaCalendarAlt className="text-3xl" />,
            title: "Book Instantly",
            description: "Select your dates and book your vehicle in just a few clicks with our secure platform.",
            color: "from-purple-400 to-purple-600"
        },
        {
            icon: <FaCreditCard className="text-3xl" />,
            title: "Secure Payment",
            description: "Complete your booking with our encrypted payment system. No hidden fees.",
            color: "from-green-400 to-green-600"
        },
        {
            icon: <FaKey className="text-3xl" />,
            title: "Pick Up & Go",
            description: "Pick up your vehicle at the scheduled time and enjoy your journey with Rentizo.",
            color: "from-orange-400 to-orange-600"
        }
    ];

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

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        },
        hover: {
            y: -10,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black text-white">
            <div className="w-11/12 mx-auto my-10">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            How Rentizo Works
                        </span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                        Get your perfect ride in just four simple steps. Our process is designed to be fast, secure, and hassle-free.
                    </p>
                </motion.div>

                {/* Steps */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            initial="hidden"
                            whileInView="visible"
                            whileHover="hover"
                            viewport={{ once: true, amount: 0.2 }}
                            className="relative group"
                        >
                            {/* <motion.div
  key={car._id || i}
  custom={i}
  variants={cardVariants}
  initial="hidden"
  whileInView="visible"
  whileHover="hover"
  viewport={{ once: true, amount: 0.2 }}
  className="group relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700" */}
                            {/* > */}
                            {/* Gradient Border Effect */}
                            <div className={`absolute -inset-0.5 bg-gradient-to-r ${step.color} rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-200`}></div>

                            {/* Step Card */}
                            <div className="relative bg-gray-800 p-8 rounded-xl h-full">
                                {/* Step Number */}
                                <div className={`absolute -top-4 -left-4 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br ${step.color} text-white font-bold`}>
                                    {index + 1}
                                </div>

                                {/* Icon */}
                                <div className={`mb-6 w-14 h-14 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white`}>
                                    {step.icon}
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                <p className="text-gray-400">{step.description}</p>

                                {/* Checkmark appears on hover */}
                                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <IoMdCheckmarkCircleOutline className="text-2xl text-green-400" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;