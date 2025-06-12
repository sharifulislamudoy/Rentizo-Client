import { motion } from 'framer-motion'; // For animation effects
import { FaRegGem, FaRegClock, FaStar } from 'react-icons/fa'; // Icons for features

// List of features to display in the section
const features = [
  {
    icon: <FaRegGem className="text-4xl text-primary" />, // Luxury gem icon
    title: 'Luxury Experience',
    description: 'Drive the most elegant and prestigious cars to make every journey unforgettable.',
  },
  {
    icon: <FaRegClock className="text-4xl text-primary" />, // Clock icon for 24/7 access
    title: '24/7 Access',
    description: 'Book anytime, from anywhere. We’re always ready to deliver your ride.',
  },
  {
    icon: <FaStar className="text-4xl text-primary" />, // Star icon for top-rated service
    title: 'Top-rated Service',
    description: 'Thousands of satisfied customers rate Rentizo as the best rental service.',
  },
];

const LuxuryExperienceSection = () => {
  return (
    <section className="py-16 px-4 bg-base-200 text-center">
      {/* Container with fade-in and slide-up animation */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}          // Start hidden and moved down
        whileInView={{ opacity: 1, y: 0 }}      // Animate to visible and original position
        transition={{ duration: 0.6 }}           // Smooth transition over 0.6 seconds
        viewport={{ once: false }}                // Animate every time it scrolls into view
        className="max-w-5xl mx-auto"
      >
        {/* Section heading */}
        <h2 className="text-4xl md:text-5xl font-bold mb-10 text-primary">
          Luxury, Comfort & Convenience
        </h2>

        {/* Section description */}
        <p className="text-base-content text-lg mb-12">
          At Rentizo, we believe in more than just getting you from point A to B.
          We offer a premium experience designed for travelers, adventurers, and professionals alike.
        </p>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}          // Start each feature slightly down and hidden
              whileInView={{ opacity: 1, y: 0 }}       // Animate into view
              transition={{ duration: 0.4, delay: index * 0.2 }}  // Stagger animation by index
              viewport={{ once: false }}
              className="bg-base-100 p-6 rounded-xl shadow-md flex justify-center items-center flex-col"
            >
              {/* Feature icon */}
              <div className="mb-4">{feature.icon}</div>
              {/* Feature title */}
              <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
              {/* Feature description */}
              <p className="text-base-content">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default LuxuryExperienceSection;
