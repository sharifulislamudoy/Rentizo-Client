import { motion } from 'framer-motion'; // Animation library for React components
import { FaTags, FaCarSide } from 'react-icons/fa'; // Icons used for offers
import { Link } from 'react-router'; // Link component for navigation between pages

// Array of special offer objects with icon, title, description, button text, and link path
const offers = [
  {
    icon: <FaTags className="text-4xl text-primary" />,
    title: 'Weekend Special',
    description: 'Get 15% off on weekend rentals. Drive more, pay less!',
    button: 'Book Now',
    link: '/available-cars',
  },
  {
    icon: <FaCarSide className="text-4xl text-primary" />,
    title: 'Holiday Luxury Deal',
    description: 'Luxury cars starting at just $99/day this holiday season.',
    button: 'Learn More',
    link: '/holiday-deal',
  },
];

const SpecialOffers = () => {
  return (
    <section className="py-16 px-4 bg-base-100">
      {/* Container with fade-in and slide-up animation when in view */}
      <motion.div
        initial={{ opacity: 0, y: 40 }} // Start transparent and slightly below
        whileInView={{ opacity: 1, y: 0 }} // Animate to visible and original position
        transition={{ duration: 0.6 }} // Animation lasts 0.6 seconds
        viewport={{ once: false }} // Animate every time element comes into view
        className="max-w-6xl mx-auto text-center"
      >
        {/* Section title */}
        <h2 className="text-4xl md:text-5xl font-bold mb-10 text-primary">Special Offers</h2>
        {/* Section subtitle */}
        <p className="text-lg text-base-content mb-12">
          Don’t miss out on our limited-time promotions and exclusive rental deals.
        </p>

        {/* Grid layout for offers, 2 columns on medium screens and up */}
        <div className="grid md:grid-cols-2 gap-8">
          {offers.map((offer, index) => (
            // Each offer card with staggered fade/slide animation and hover scale effect
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }} // Start transparent and slightly down
              whileInView={{ opacity: 1, y: 0 }} // Animate in when visible
              transition={{ duration: 0.4, delay: index * 0.2 }} // Delay increases per item
              viewport={{ once: false }}
              whileHover={{ scale: 1.03 }} // Slightly enlarge on hover
              className="bg-base-200 rounded-xl p-6 shadow-md hover:shadow-lg transition flex justify-center items-center flex-col"
            >
              {/* Icon at the top */}
              <div className="mb-4">{offer.icon}</div>
              {/* Offer title */}
              <h3 className="text-2xl font-semibold mb-2">{offer.title}</h3>
              {/* Offer description */}
              <p className="mb-4 text-base-content">{offer.description}</p>
              {/* Button linking to offer details or booking page */}
              <Link to={offer.link} className="btn btn-sm btn-primary">
                {offer.button}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default SpecialOffers;
