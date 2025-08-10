import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useState } from 'react';
import { ReTitle } from 're-title';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "How do I rent a car through Rentizo?",
            answer: "Renting a car with Rentizo is simple. Just create an account, browse available vehicles, select your dates, and complete the booking process. You'll receive a confirmation email with all the details.",
            category: "Booking"
        },
        {
            question: "What are the requirements to rent a car?",
            answer: "You must be at least 21 years old with a valid driver's license and a major credit card in your name. Some vehicle categories may have higher age requirements.",
            category: "Requirements"
        },
        {
            question: "Can I modify or cancel my reservation?",
            answer: "Yes, you can modify or cancel your reservation up to 24 hours before your scheduled pickup time without penalty. Changes can be made through your account dashboard.",
            category: "Booking"
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover) as well as Apple Pay and Google Pay. Debit cards are accepted with additional verification.",
            category: "Payments"
        },
        {
            question: "Is insurance included in the rental price?",
            answer: "Basic coverage is included, but we recommend purchasing additional protection for comprehensive coverage. You can select your preferred insurance options during checkout.",
            category: "Insurance"
        },
        {
            question: "What happens if I return the car late?",
            answer: "Late returns may incur additional charges. We provide a 59-minute grace period, after which you'll be charged for an extra day. Please contact us if you anticipate being late.",
            category: "Returns"
        },
        {
            question: "Can I rent a car one-way?",
            answer: "Yes, we offer one-way rentals between most major locations. Additional fees may apply depending on the drop-off location. Check availability during the booking process.",
            category: "Locations"
        },
        {
            question: "How does the fuel policy work?",
            answer: "Our standard policy is 'full-to-full' - you receive the car with a full tank and should return it full. We also offer prepaid fuel options if you prefer not to refuel before returning.",
            category: "Policies"
        }
    ];

    const categories = [...new Set(faqs.map(faq => faq.category))];

    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredFaqs = selectedCategory === "All" 
        ? faqs 
        : faqs.filter(faq => faq.category === selectedCategory);

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black text-white" id="faq">
            <ReTitle title='Rentizo | FAQ'/>
            <div className="w-11/12 mx-auto">
                {/* Header */}
                <motion.div 
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Frequently Asked Questions
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
                        Find quick answers to common questions about our rental process, policies, and services.
                    </p>
                </motion.div>

                {/* Category Filters */}
                <motion.div
                    className="flex flex-wrap justify-center gap-3 mb-12"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory("All")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === "All" ? 'bg-gradient-to-r from-primary to-secondary text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                    >
                        All Questions
                    </motion.button>
                    
                    {categories.map((category, index) => (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category ? 'bg-gradient-to-r from-primary to-secondary text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                        >
                            {category}
                        </motion.button>
                    ))}
                </motion.div>

                {/* FAQ Accordion */}
                <div className="w-full">
                    {filteredFaqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            className="mb-4 overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <motion.div
                                className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border ${activeIndex === index ? 'border-primary' : 'border-gray-800'} cursor-pointer`}
                                onClick={() => toggleAccordion(index)}
                                whileHover={{ borderColor: "#3B82F6" }}
                            >
                                <div className="flex items-center justify-between p-6">
                                    <h3 className="text-lg md:text-xl font-semibold text-white">
                                        {faq.question}
                                    </h3>
                                    {activeIndex === index ? (
                                        <FaChevronUp className="text-primary text-lg" />
                                    ) : (
                                        <FaChevronDown className="text-primary text-lg" />
                                    )}
                                </div>
                            </motion.div>

                            {activeIndex === index && (
                                <motion.div
                                    className="px-6 pb-6 pt-2 bg-gray-900 rounded-b-xl"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <p className="text-gray-300">{faq.answer}</p>
                                    {faq.category && (
                                        <div className="mt-4">
                                            <span className="inline-block bg-gray-800 text-primary text-xs px-3 py-1 rounded-full">
                                                {faq.category}
                                            </span>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    className="mt-16 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-2xl md:text-3xl font-bold mb-6">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Still have questions?
                        </span>
                    </h3>
                    <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
                        Can't find what you're looking for? Our support team is available 24/7 to assist you.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <motion.a
                            href="/contact-us"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-primary to-secondary text-white py-3 px-8 rounded-lg font-semibold"
                        >
                            Contact Support
                        </motion.a>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white py-3 px-8 rounded-lg font-semibold transition-colors"
                        >
                            Live Chat
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQ;