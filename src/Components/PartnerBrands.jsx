import { motion } from 'framer-motion';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const PartnerBrands = () => {
    const partners = [
        {
            id: 1,
            name: "Audi",
            logo: "https://www.audi.com/content/dam/gbp2/company/logos/audi-logo-2023.svg",
            category: "Luxury Vehicles"
        },
        {
            id: 2,
            name: "BMW",
            logo: "https://www.bmw.com/content/dam/bmw/marketBMWCOM/bmw_com_logo.svg",
            category: "Performance Cars"
        },
        {
            id: 3,
            name: "Tesla",
            logo: "https://www.tesla.com/themes/custom/tesla_frontend/assets/tesla_logo_icon.svg",
            category: "Electric Vehicles"
        },
        {
            id: 4,
            name: "Mercedes",
            logo: "https://www.mercedes-benz.com/content/dam/brandhub/mbsocialcar/mbsocialcar-mercedes-benz-logo.svg",
            category: "Premium Sedans"
        },
        {
            id: 5,
            name: "Enterprise",
            logo: "https://www.enterprise.com/content/experience-fragments/ecom/en/footer/master/_jcr_content/root/footer/logo.coreimg.svg",
            category: "Rental Network"
        },
        {
            id: 6,
            name: "Michelin",
            logo: "https://www.michelin.com/content/dam/michelin/www/logo.svg",
            category: "Tire Partners"
        }
    ];

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
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    return (
        <section className="pt-25 px-4 sm:px-6 lg:px-8 bg-black text-white">
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
                            Our Trusted Partners
                        </span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                        Collaborating with industry leaders to bring you the best rental experience
                    </p>
                </motion.div>

                {/* Partners Grid */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {partners.map((partner) => (
                        <motion.div
                            key={partner.id}
                            variants={itemVariants}
                            whileHover="hover"
                            className="group"
                        >
                            <div className="bg-gray-800 rounded-xl p-6 h-full flex flex-col items-center justify-center border border-gray-700 group-hover:border-primary transition-all duration-300">
                                {/* Logo */}
                                <div className="h-16 mb-4 flex items-center">
                                    <img
                                        src={partner.logo}
                                        alt={partner.name}
                                        className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                                    />
                                </div>

                                {/* Partner Info (appears on hover) */}
                                <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <h4 className="font-bold">{partner.name}</h4>
                                    <p className="text-sm text-gray-400">{partner.category}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Testimonial */}
                <motion.div
                    className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 md:p-12 border border-gray-700"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                    Strategic Partnerships
                                </span>
                            </h3>
                            <p className="text-gray-400 mb-6">
                                Our collaborations with top automotive brands ensure you get access to the latest models,
                                premium features, and exclusive deals unavailable elsewhere.
                            </p>
                            {/* <div className="flex space-x-4 flex-col md:flex-row">
                                <button className="px-6 py-2 bg-primary rounded-full font-medium flex items-center">
                                    Become a Partner <FaArrowRight className="ml-2" />
                                </button>
                                <button className="px-6 py-2 border border-gray-600 rounded-full font-medium flex items-center hover:border-primary transition-colors">
                                    View All <FaArrowRight className="ml-2" />
                                </button>
                            </div> */}
                        </div>
                        <div className="md:w-1/2 bg-gray-700 rounded-xl overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1493238792000-8113da705763?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                alt="Partner showcase"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default PartnerBrands;