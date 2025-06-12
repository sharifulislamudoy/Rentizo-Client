import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import useScrollToTop from '../Utils/UseScrollToTop';

const AvailableCars = () => {
  useScrollToTop(); // Scroll to top when component mounts

  // State to store cars, view mode, sorting option, and search term
  const [cars, setCars] = useState([]);
  const [view, setView] = useState('grid'); // grid or list view
  const [sortBy, setSortBy] = useState('newest'); // sorting criteria
  const [searchTerm, setSearchTerm] = useState(''); // search input

  // Fetch cars data from server on component mount
  useEffect(() => {
    fetch('https://rentizo-server.vercel.app/cars/')
      .then((res) => res.json())
      .then((data) => {
        // Filter to show only available cars
        const availableCars = data.filter(car => car.availability === "Available");
        setCars(availableCars);
      });
  }, []);

  // Sort cars based on selected sort option
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

  // Filter cars by search term matching model or location
  const filteredCars = cars.filter((car) => {
    const search = searchTerm.toLowerCase();
    return (
      car.carModel.toLowerCase().includes(search) ||
      car.location?.toLowerCase().includes(search)
    );
  });

  // Sort the filtered cars
  const sortedCars = sortCars(filteredCars);

  // Animation variants for individual car cards
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, y: 30, transition: { duration: 0.2 } },
  };

  // Animation variant for container to stagger children animations
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
      {/* Header with title, search, sort, and view toggles */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold">Available Cars</h2>

        <div className="flex items-center gap-2">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search by model, Location"
            className="input input-bordered"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Sort dropdown */}
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

          {/* View toggle buttons */}
          <button
            className={`btn ${view === 'grid' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setView('grid')}
          >
            Grid
          </button>
          <button
            className={`btn ${view === 'list' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setView('list')}
          >
            List
          </button>
        </div>
      </div>

      {/* Show cars in grid or list view with animation */}
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
