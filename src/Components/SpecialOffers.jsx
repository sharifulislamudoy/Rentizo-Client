import { motion } from 'framer-motion';
import { FaTags, FaCarSide } from 'react-icons/fa';
import { Link } from 'react-router';

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
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false }}
        className="max-w-6xl mx-auto text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-10 text-primary">Special Offers</h2>
        <p className="text-lg text-base-content mb-12">
          Don’t miss out on our limited-time promotions and exclusive rental deals.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {offers.map((offer, index) => (
            <motion.div
              key={index}
              initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: false }}
              whileHover={{ scale: 1.03 }}
              className="bg-base-200 rounded-xl p-6 shadow-md hover:shadow-lg transition flex justify-center items-center flex-col"
            >
              <div className="mb-4">{offer.icon}</div>
              <h3 className="text-2xl font-semibold mb-2">{offer.title}</h3>
              <p className="mb-4 text-base-content">{offer.description}</p>
              <Link
                to={offer.link}
                className="btn btn-sm btn-primary"
              >
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
