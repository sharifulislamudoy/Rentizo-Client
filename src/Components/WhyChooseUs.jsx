import { FaCarSide, FaMoneyBillWave, FaCalendarCheck, FaHeadset } from 'react-icons/fa';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <FaCarSide className="text-4xl text-primary mb-4" />,
    title: 'Wide Variety of Cars',
    desc: 'Choose from economy to luxury vehicles tailored to your needs.',
  },
  {
    icon: <FaMoneyBillWave className="text-4xl text-primary mb-4" />,
    title: 'Affordable Prices',
    desc: 'Enjoy competitive daily rates without compromising on quality.',
  },
  {
    icon: <FaCalendarCheck className="text-4xl text-primary mb-4" />,
    title: 'Easy Booking Process',
    desc: 'Book your ride effortlessly in just a few clicks.',
  },
  {
    icon: <FaHeadset className="text-4xl text-primary mb-4" />,
    title: '24/7 Customer Support',
    desc: 'We’re here anytime to assist you with your travel needs.',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-base-300 text-center">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-12 font-poppins text-primary"
        >
          Why Choose Us?
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 flex justify-center items-center flex-col bg-base-200 rounded-xl shadow hover:shadow-xl transition duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: false }}
            >
              {feature.icon}
              <h3 className="text-xl font-semibold mb-2 font-poppins">{feature.title}</h3>
              <p className="text-sm text-gray-600 font-poppins">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
