import { motion } from 'framer-motion';
import { FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { useState } from 'react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSubscribed(true);
      setEmail('');
    }, 1500);
  };

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
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black text-white">
      <div className="w-11/12 mx-auto">
        <motion.div
          className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-700 shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Visual */}
            <div className="relative h-64 lg:h-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-20"></div>
              <img 
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Newsletter"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-900 to-transparent">
                <motion.div 
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <FaPaperPlane className="text-primary" />
                  <span className="text-sm font-medium">Exclusive content delivered weekly</span>
                </motion.div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-8 md:p-12">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold mb-4"
                  variants={itemVariants}
                >
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    Stay Updated
                  </span>
                </motion.h2>
                
                <motion.p 
                  className="text-gray-400 mb-8"
                  variants={itemVariants}
                >
                  Subscribe to our newsletter for exclusive offers, new vehicle announcements, and travel tips.
                </motion.p>

                {subscribed ? (
                  <motion.div
                    className="bg-green-900/20 border border-green-800 rounded-lg p-6 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FaCheckCircle className="text-green-400 text-4xl mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Thank you for subscribing!</h3>
                    <p className="text-gray-300">You'll receive our next newsletter soon.</p>
                  </motion.div>
                ) : (
                  <motion.form 
                    onSubmit={handleSubmit}
                    variants={itemVariants}
                  >
                    <div className="mb-6">
                      <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    
                    <motion.button
                      type="submit"
                      className="w-full py-3 px-6 bg-gradient-to-r from-primary to-secondary rounded-lg font-medium flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <span>Subscribe Now</span>
                          <FaPaperPlane />
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}

                <motion.p 
                  className="text-xs text-gray-500 mt-6"
                  variants={itemVariants}
                >
                  We respect your privacy. Unsubscribe at any time.
                </motion.p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSignup;