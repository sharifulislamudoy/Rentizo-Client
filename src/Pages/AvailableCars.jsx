import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import useScrollToTop from '../Utils/UseScrollToTop';

const AvailableCars = () => {
  useScrollToTop();

  const [allCars, setAllCars] = useState([]);
  const [availableCars, setAvailableCars] = useState([]);
  const [view, setView] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('https://rentizo-server.vercel.app/cars/')
      .then((res) => res.json())
      .then((data) => {
        setAllCars(data);
        const available = data.filter(car => car.availability === "Available");
        setAvailableCars(available);
      });
  }, []);

  const sortCars = (cars) => {
    const sorted = [...cars];
    if (sortBy === 'newest') {
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'low-price') {
      return sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sortBy === 'high-price') {
      return sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
    }
    return sorted;
  };

  const filteredCars = availableCars.filter((car) => {
    const search = searchTerm.toLowerCase();
    return (
      car.carModel.toLowerCase().includes(search) ||
      car.location?.toLowerCase().includes(search)
    );
  });

  const sortedCars = sortCars(filteredCars);

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, y: 30, transition: { duration: 0.2 } },
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 min-h-screen w-11/12 mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold">Available Cars</h2>
          <div className="flex items-center gap-2 mt-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium w-fit">
            <span className="status status-info animate-bounce w-2 h-2 rounded-full"></span>
            {availableCars.length} / {allCars.length} Cars Available
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Search by model, Location"
            className="input input-bordered"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="select select-bordered"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Date Added (Newest)</option>
            <option value="oldest">Date Added (Oldest)</option>
            <option value="low-price">Price (Lowest)</option>
            <option value="high-price">Price (Highest)</option>
          </select>

          {/* Toggle for Grid/List */}
          <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-fit border p-2">
            <legend className="fieldset-legend text-sm">Layout View</legend>
            <label className="label cursor-pointer gap-2">
              <span className="label-text text-sm font-medium">List</span>
              <input
                type="checkbox"
                className="toggle"
                checked={view === 'grid'}
                onChange={() => setView(view === 'grid' ? 'list' : 'grid')}
              />
              <span className="label-text text-sm font-medium">Grid</span>
            </label>
          </fieldset>
        </div>
      </div>

      {/* Cars */}
      {view === 'grid' ? (
        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {sortedCars.map((car) => (
              <motion.div
                key={car._id}
                layout
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
                className="card bg-base-100 shadow-xl transition-transform duration-300"
              >
                <figure>
                  <img src={car.image} alt={car.carModel} className="w-full h-48 object-cover" />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{car.carModel}</h2>
                  <p><strong>Price/Day:</strong> ${car.pricePerDay}</p>
                  <p><strong>Location:</strong> {car.location}</p>
                  <div className="card-actions justify-end">
                    <Link to={`/car-details/${car._id}`} className="btn btn-primary">
                      Book Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {sortedCars.map((car) => (
              <motion.div
                key={car._id}
                layout
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ scale: 1.02, boxShadow: '0px 4px 15px rgba(0,0,0,0.1)' }}
                className="flex flex-col md:flex-row items-center gap-4 p-4 border rounded-lg shadow bg-base-100 transition-transform duration-300"
              >
                <img src={car.image} alt={car.carModel} className="w-full md:w-48 h-36 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{car.carModel}</h3>
                  <p><strong>Price/Day:</strong> ${car.pricePerDay}</p>
                  <p><strong>Location:</strong> {car.location}</p>
                </div>
                <Link to={`/car-details/${car._id}`} className="btn btn-primary self-start md:self-center">
                  Book Now
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AvailableCars;
