import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { FaCar, FaUsers, FaSmile, FaMapMarkedAlt, FaAward } from 'react-icons/fa';
import { IoIosRocket } from 'react-icons/io';

const StatsAchievements = () => {
    const stats = [
        {
            icon: <FaCar className="text-4xl" />,
            value: 1250,
            suffix: "+",
            label: "Vehicles Rented",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: <FaUsers className="text-4xl" />,
            value: 850,
            suffix: "+",
            label: "Happy Customers",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: <FaSmile className="text-4xl" />,
            value: 98,
            suffix: "%",
            label: "Satisfaction Rate",
            color: "from-green-500 to-green-600"
        },
        {
            icon: <FaMapMarkedAlt className="text-4xl" />,
            value: 75,
            suffix: "+",
            label: "Locations",
            color: "from-orange-500 to-orange-600"
        }
    ];

    const achievements = [
        {
            icon: <FaAward className="text-2xl" />,
            title: "Best Rental Platform 2023",
            description: "Awarded by Travel & Hospitality Association"
        },
        {
            icon: <IoIosRocket className="text-2xl" />,
            title: "Fastest Growing Startup",
            description: "Recognized by Business Tech Magazine"
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
            y: -5,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black text-white">
            <div className="w-11/12 mx-auto">
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
                            Our Impact in Numbers
                        </span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                        Trusted by thousands of customers and recognized by industry leaders
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover="hover"
                            className="relative group"
                        >
                            {/* Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-xl opacity-20 blur-md group-hover:opacity-30 transition-opacity`}></div>
                            
                            {/* Stat Card */}
                            <div className="relative bg-gray-800 p-8 rounded-xl border border-gray-700 h-full flex flex-col items-center text-center">
                                {/* Icon */}
                                <div className={`mb-6 w-20 h-20 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                                    {stat.icon}
                                </div>
                                
                                {/* Animated Counter */}
                                <div className="text-3xl font-bold mb-2">
                                    <CountUp 
                                        end={stat.value} 
                                        duration={3} 
                                        suffix={stat.suffix}
                                        className="bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-300"
                                    />
                                </div>
                                
                                {/* Label */}
                                <p className="text-gray-400">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Achievements Section */}
                <motion.div
                    className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-800"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3">
                        {/* Left Content */}
                        <div className="lg:col-span-2 p-12">
                            <h3 className="text-3xl font-bold mb-6">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                    Industry Recognition
                                </span>
                            </h3>
                            
                            <motion.div
                                className="space-y-8"
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                {achievements.map((achievement, index) => (
                                    <motion.div 
                                        key={index}
                                        variants={itemVariants}
                                        className="flex items-start"
                                    >
                                        <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-lg mr-6">
                                            {achievement.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-2">{achievement.title}</h4>
                                            <p className="text-gray-400">{achievement.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                        
                        {/* Right Image */}
                        <div className="hidden lg:block relative bg-gray-800">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-70"></div>
                            <img 
                                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                                alt="Award ceremony"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-8 left-8 right-8 p-6 bg-gradient-to-r from-primary to-secondary rounded-lg">
                                <p className="font-bold">"Rentizo has revolutionized the car rental industry with their innovative platform"</p>
                                <p className="text-sm mt-2">- Tech Business Review</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default StatsAchievements;