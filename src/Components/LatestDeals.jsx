import { motion } from 'framer-motion';
import { FaCar, FaRegClock, FaTag, FaHeart, FaRegStar, FaStar } from 'react-icons/fa';
import { IoFlashSharp } from 'react-icons/io5';

const LatestDeals = () => {
    const deals = [
        {
            id: 1,
            title: "Weekend Getaway Special",
            discount: "30% OFF",
            code: "WEEKEND30",
            expires: "Ends in 2 days",
            image: "https://images.unsplash.com/photo-1494905998402-395d579af36f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            featured: true
        },
        {
            id: 2,
            title: "First-Time Renter Deal",
            discount: "$50 OFF",
            code: "NEW50",
            expires: "Ends in 5 days",
            image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        },
        {
            id: 3,
            title: "Summer Road Trip Sale",
            discount: "15% OFF",
            code: "SUMMER15",
            expires: "Ends in 1 week",
            image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        },
        {
            id: 4,
            title: "Luxury Vehicle Promotion",
            discount: "1 Day Free",
            code: "LUXFREE",
            expires: "Ends in 3 days",
            image: "https://images.unsplash.com/photo-1493238792000-8113da705763?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
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
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black text-white">
            <div className="w-11/12 mx-auto mt-10">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center mb-4 px-4 py-2 bg-gradient-to-r from-primary to-secondary rounded-full text-sm font-medium">
                        <IoFlashSharp className="mr-2" />
                        LIMITED TIME OFFERS
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Latest Deals & Offers
                        </span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                        Don't miss out on these exclusive promotions to save on your next rental
                    </p>
                </motion.div>

                {/* Deals Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {deals.map((deal) => (
                        <motion.div
                            key={deal.id}
                            variants={itemVariants}
                            whileHover="hover"
                            className="relative group"
                        >
                            {/* Featured Ribbon */}
                            {deal.featured && (
                                <div className="absolute -top-3 -right-3 z-10 bg-gradient-to-r from-yellow-400 to-yellow-600 text-xs font-bold px-3 py-1 rounded-full shadow-lg rotate-12">
                                    HOT DEAL
                                </div>
                            )}

                            {/* Deal Card */}
                            <div className="relative bg-gray-800 rounded-xl overflow-hidden h-full border border-gray-700 group-hover:border-primary transition-all duration-300">
                                {/* Image */}
                                <div className="h-48 overflow-hidden">
                                    <img 
                                        src={deal.image} 
                                        alt={deal.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold">{deal.title}</h3>
                                        <button className="text-gray-400 hover:text-red-500 transition-colors">
                                            <FaHeart />
                                        </button>
                                    </div>

                                    {/* Discount Badge */}
                                    <div className="mb-4">
                                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-primary to-secondary rounded-full text-sm font-bold">
                                            {deal.discount}
                                        </span>
                                    </div>

                                    {/* Deal Info */}
                                    <div className="space-y-3 text-sm text-gray-400">
                                        <div className="flex items-center">
                                            <FaTag className="mr-2 text-primary" />
                                            <span>Use code: <strong className="text-white">{deal.code}</strong></span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaRegClock className="mr-2 text-primary" />
                                            <span>{deal.expires}</span>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <button className="mt-6 w-full py-2 bg-gray-700 hover:bg-primary rounded-md font-medium transition-colors duration-300 flex items-center justify-center">
                                        <FaCar className="mr-2" />
                                        Claim Offer
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* View All CTA */}
                <motion.div
                    className="mt-16 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <button className="px-8 py-3 border-2 border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition-all duration-300">
                        View All Offers
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default LatestDeals;