import { motion } from 'framer-motion';
import { ReTitle } from 're-title';
import CountUp from 'react-countup';
import { FaCar, FaShieldAlt, FaHandshake, FaMapMarkerAlt } from 'react-icons/fa';

const AboutUs = () => {
    // Animation variants
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
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    const stats = [
        { value: 500, suffix: "+", label: "Happy Customers" },
        { value: 100, suffix: "+", label: "Premium Vehicles" },
        { value: 24, suffix: "/7", label: "Customer Support" },
        { value: 50, suffix: "+", label: "Locations" }
    ];

    const features = [
        {
            icon: <FaCar className="text-3xl text-primary" />,
            title: "Wide Selection",
            description: "Choose from our diverse fleet of luxury, economy, and family vehicles."
        },
        {
            icon: <FaShieldAlt className="text-3xl text-primary" />,
            title: "Fully Insured",
            description: "All our vehicles come with comprehensive insurance coverage."
        },
        {
            icon: <FaHandshake className="text-3xl text-primary" />,
            title: "Trusted Partners",
            description: "We work with verified car owners to ensure quality and reliability."
        },
        {
            icon: <FaMapMarkerAlt className="text-3xl text-primary" />,
            title: "Nationwide",
            description: "Pick up your rental at any of our convenient locations."
        }
    ];

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black text-white">
            <ReTitle  title='Rentizo | About'/>
            <div className="w-11/12 mx-auto">
                {/* Hero Section */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            About Rentizo
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
                        Revolutionizing car rentals with seamless digital experiences since 2023.
                        We connect car owners with renters through our trusted platform.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-800 text-center"
                        >
                            <div className="text-3xl font-bold text-primary mb-2"><CountUp end={stat.value} duration={8} suffix={stat.suffix} /></div>
                            <div className="text-gray-300">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Our Story */}
                <div className="flex flex-col lg:flex-row gap-12 items-center mb-16">
                    <motion.div
                        className="lg:w-1/2"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary rounded-2xl opacity-20 blur"></div>
                            <img
                                src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                alt="Our Team"
                                className="relative rounded-xl w-full h-auto object-cover"
                            />
                        </div>
                    </motion.div>
                    <motion.div
                        className="lg:w-1/2"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-2xl md:text-3xl font-bold mb-6 text-primary">Our Story</h3>
                        <p className="text-gray-300 mb-4">
                            Founded in 2023, Rentizo began with a simple mission: to make car rental easier,
                            more affordable, and more transparent. We noticed traditional rental services
                            were stuck in the past with complicated processes and hidden fees.
                        </p>
                        <p className="text-gray-300 mb-4">
                            Our platform connects car owners with responsible renters, creating a
                            community where everyone benefits. Owners earn money from their idle
                            vehicles, while renters get access to a wider selection at better prices.
                        </p>
                        <p className="text-gray-300">
                            Today, we're proud to be the fastest growing peer-to-peer car rental
                            platform in the region, with thousands of satisfied customers and
                            hundreds of vehicle owners trusting our service.
                        </p>
                    </motion.div>
                </div>

                {/* Features */}
                <motion.div
                    className="mb-16"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-2xl md:text-3xl font-bold mb-12 text-center text-primary">Why Choose Rentizo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -5 }}
                                className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-800 hover:border-primary transition-all"
                            >
                                <div className="mb-4">{feature.icon}</div>
                                <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                                <p className="text-gray-300">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutUs;