import { motion } from 'framer-motion';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';

const PopularDestinations = () => {
    const destinations = [
        {
            id: 1,
            name: "Coastal Highway Drive",
            image: "https://images.unsplash.com/photo-1470114716159-e389f8712fda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            rating: 4.9,
            rentals: 1200,
            distance: "50-200 km"
        },
        {
            id: 2,
            name: "Mountain Getaway",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            rating: 4.8,
            rentals: 980,
            distance: "100-300 km"
        },
        {
            id: 3,
            name: "Urban Explorer",
            image: "https://i.ibb.co.com/pB7tgGk0/Untitled-design-2025-08-09-T143729-838.png",
            rating: 4.7,
            rentals: 1500,
            distance: "City routes"
        },
        {
            id: 4,
            name: "Wine Country Tour",
            image: "https://i.ibb.co.com/SDWJSNh3/Untitled-design-2025-08-09-T143933-932.png",
            rating: 4.9,
            rentals: 750,
            distance: "80-150 km"
        }
    ];

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black text-white">
            <div className="w-11/12 mx-auto my-20">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Popular Destinations
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
                        Discover the most sought-after routes our customers love to explore with Rentizo vehicles
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {destinations.map((destination, index) => (
                        <motion.div
                            key={destination.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.03 }}
                            className="group relative overflow-hidden rounded-2xl shadow-xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                            <img
                                src={destination.image}
                                alt={destination.name}
                                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            
                            <div className="absolute bottom-0 left-0 z-20 p-6 w-full">
                                <div className="flex items-center mb-2">
                                    <FaStar className="text-yellow-400 mr-1" />
                                    <span className="font-bold">{destination.rating}</span>
                                    <span className="mx-2">•</span>
                                    <span>{destination.rentals}+ rentals</span>
                                </div>
                                
                                <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
                                
                                <div className="flex items-center text-gray-300">
                                    <FaMapMarkerAlt className="mr-2" />
                                    <span>{destination.distance}</span>
                                </div>
                            </div>
                            
                            {/* <div className="absolute top-4 right-4 z-20">
                                <button className="bg-primary/90 hover:bg-primary text-white px-4 py-2 rounded-full text-sm font-medium transition-all">
                                    View Routes
                                </button>
                            </div> */}
                        </motion.div>
                    ))}
                </div>

                {/* <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <button className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-primary/30 transition-all">
                        Explore All Destinations
                    </button>
                </motion.div> */}
            </div>
        </section>
    );
};

export default PopularDestinations;