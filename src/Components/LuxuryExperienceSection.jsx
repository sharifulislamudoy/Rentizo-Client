import { motion } from 'framer-motion';
import { FaRegGem, FaRegClock, FaStar } from 'react-icons/fa';

const features = [
  {
    icon: <FaRegGem className="text-4xl text-primary" />,
    title: 'Luxury Experience',
    description: 'Drive the most elegant and prestigious cars to make every journey unforgettable.',
  },
  {
    icon: <FaRegClock className="text-4xl text-primary" />,
    title: '24/7 Access',
    description: 'Book anytime, from anywhere. We’re always ready to deliver your ride.',
  },
  {
    icon: <FaStar className="text-4xl text-primary" />,
    title: 'Top-rated Service',
    description: 'Thousands of satisfied customers rate Rentizo as the best rental service.',
  },
];

const LuxuryExperienceSection = () => {
  return (
    <section className="py-16 px-4 bg-base-200 text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false }}
        className="max-w-5xl mx-auto"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-10 text-primary">
          Luxury, Comfort & Convenience
        </h2>

        <p className="text-base-content text-lg mb-12">
          At Rentizo, we believe in more than just getting you from point A to B.
          We offer a premium experience designed for travelers, adventurers, and professionals alike.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.2 }}
              viewport={{ once: false }}
              className="bg-base-100 p-6 rounded-xl shadow-md flex justify-center items-center flex-col"
            >
              <div className="mb-4">{feature.icon}</div>
              <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
              <p className="text-base-content">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default LuxuryExperienceSection;
