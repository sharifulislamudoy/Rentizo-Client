import { motion } from 'framer-motion';
import { ReTitle } from 're-title';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { useState } from 'react';

const ContactUs = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const contactMethods = [
        {
            icon: <FaPhone className="text-2xl text-primary" />,
            title: "Phone",
            details: "+1 (555) 123-4567",
            description: "Available 24/7 for urgent inquiries"
        },
        {
            icon: <FaEnvelope className="text-2xl text-primary" />,
            title: "Email",
            details: "support@rentizo.com",
            description: "Typically respond within 2 business hours"
        },
        {
            icon: <FaMapMarkerAlt className="text-2xl text-primary" />,
            title: "Headquarters",
            details: "123 Auto Drive, Suite 100",
            description: "San Francisco, CA 94107"
        },
        {
            icon: <FaClock className="text-2xl text-primary" />,
            title: "Business Hours",
            details: "Monday - Friday: 9am - 7pm",
            description: "Saturday: 10am - 4pm"
        }
    ];

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('https://rentizo-server.vercel.app/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Message Sent!',
                    text: result.message,
                    confirmButtonColor: '#00BFA6'
                }).then(() => {
                    // Reset form
                    setFormData({
                        name: '',
                        email: '',
                        subject: '',
                        message: ''
                    });
                    navigate('/');
                });
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            Swal.fire({
                icon: 'error',
                title: 'Failed to Send',
                text: error.message || 'Failed to send message. Please try again.',
                confirmButtonColor: '#00BFA6'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black text-white" id="contact">
            <ReTitle title='Contact Us' />
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
                            Contact Us
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
                        Have questions or need assistance? Our team is ready to help you with any inquiries.
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Contact Methods */}
                    <motion.div 
                        className="lg:w-1/2"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {contactMethods.map((method, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ y: -5 }}
                                    className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-800 hover:border-primary transition-all h-full"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1">{method.icon}</div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">{method.title}</h3>
                                            <p className="text-primary font-medium mb-1">{method.details}</p>
                                            <p className="text-gray-400 text-sm">{method.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Map */}
                        <motion.div
                            className="mt-8 rounded-xl overflow-hidden border-2 border-primary"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.665456986449!2d-122.4194159240353!3d37.774929971902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1689878816787!5m2!1sen!2sus"
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="grayscale hover:grayscale-0 transition-all"
                                title="Rentizo Headquarters Location"
                            ></iframe>
                        </motion.div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div 
                        className="lg:w-1/2"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-xl border border-gray-800">
                            <h3 className="text-2xl font-bold mb-6 text-primary">Send Us a Message</h3>
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium mb-2">Your Name</label>
                                        <input 
                                            type="text" 
                                            id="name" 
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-500"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-500"
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                                    <input 
                                        type="text" 
                                        id="subject" 
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-500"
                                        placeholder="How can we help?"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium mb-2">Your Message</label>
                                    <textarea 
                                        id="message" 
                                        rows="5" 
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-500"
                                        placeholder="Tell us about your inquiry..."
                                        required
                                    ></textarea>
                                </div>
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? 'Sending...' : (<><FiSend className="text-lg" /> Send Message</>)}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </div>

                {/* FAQ CTA */}
                <motion.div
                    className="mt-16 text-center bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-xl border border-gray-800"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-primary">Need Immediate Help?</h3>
                    <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
                        Check out our FAQ section for quick answers to common questions about rentals, bookings, and payments.
                    </p>
                    <Link
                        to={'/faq'}
                        className="bg-transparent border-2 border-primary text-primary hover:text-black py-2 px-6 rounded-lg font-semibold transition-colors"
                    >
                        Visit FAQ Page
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default ContactUs;