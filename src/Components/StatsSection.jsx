import React from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

const stats = [
  { title: 'Cars Available', value: 850 },
  { title: 'Happy Customers', value: 25000 },
  { title: 'Total Bookings', value: 40000 },
  { title: 'Cities Covered', value: 35 },
  { title: 'Verified Partners', value: 120 },
  { title: 'Customer Rating', value: 4.8, suffix: ' / 5' },
  { title: 'Years in Business', value: 5 },
  { title: 'Kilometers Driven', value: 10, suffix: 'M+ km' },
];

const StatsSection = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="bg-base-200 rounded-2xl shadow-md p-6 text-center"
        >
          <div className="text-4xl font-bold text-indigo-600">
            <CountUp
              end={stat.value}
              duration={10}
              suffix={stat.suffix || '+'}
              decimals={stat.title === 'Customer Rating' ? 1 : 0}
            />
          </div>
          <p className="mt-2 text-gray-600 text-lg font-medium">{stat.title}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsSection;
