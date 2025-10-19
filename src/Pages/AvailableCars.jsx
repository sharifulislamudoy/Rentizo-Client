import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaFilter,
  FaStar,
  FaMapMarkerAlt,
  FaTimes,
  FaBars,
} from "react-icons/fa";
import { ReTitle } from "re-title";

const AvailableCars = () => {
  const [allCars, setAllCars] = useState([]);
  const [availableCars, setAvailableCars] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const carTypes = [...new Set(allCars.map((car) => car.carType))];

  useEffect(() => {
    fetch("http://localhost:3000/cars/")
      .then((res) => res.json())
      .then((data) => {
        setAllCars(data);
        const available = data.filter((car) => car.availability === "Available");
        setAvailableCars(available);
      });
  }, []);

  const sortCars = (cars) => {
    const sorted = [...cars];
    if (sortBy === "newest") {
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "low-price") {
      return sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sortBy === "high-price") {
      return sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
    }
    return sorted;
  };

  const filteredCars = availableCars.filter((car) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      car.carModel.toLowerCase().includes(search) ||
      car.location?.toLowerCase().includes(search);
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(car.carType);
    return matchesSearch && matchesType;
  });

  const sortedCars = sortCars(filteredCars);

  const toggleCarType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTypes([]);
    setSortBy("newest");
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
    hover: {
      scale: 1.05,
      boxShadow:
        "0 12px 25px -5px rgba(59, 130, 246, 0.5), 0 10px 15px -5px rgba(59, 130, 246, 0.3)",
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const filterSidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black text-white min-h-screen">
      <ReTitle title="Available Cars" />
      
      {/* Mobile Filter Overlay */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsFilterOpen(false)}
            />
            <motion.div
              variants={filterSidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed left-0 top-0 h-full w-80 bg-gray-900 z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Filters</h3>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    aria-label="Close filters"
                  >
                    <FaTimes className="text-lg" />
                  </button>
                </div>
                <FilterContent
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  carTypes={carTypes}
                  selectedTypes={selectedTypes}
                  toggleCarType={toggleCarType}
                  clearFilters={clearFilters}
                  sortedCars={sortedCars}
                  availableCars={availableCars}
                  allCars={allCars}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="w-11/12 mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Available Cars
            </span>
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300 mt-2">
            Choose from our premium selection of available vehicles
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar - Desktop */}
          <motion.div
            className="hidden lg:block w-80 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gray-950 rounded-xl p-6 border border-gray-700 sticky top-24">
              <FilterContent
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortBy={sortBy}
                setSortBy={setSortBy}
                carTypes={carTypes}
                selectedTypes={selectedTypes}
                toggleCarType={toggleCarType}
                clearFilters={clearFilters}
                sortedCars={sortedCars}
                availableCars={availableCars}
                allCars={allCars}
              />
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <motion.div
              className="lg:hidden mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-lg border border-gray-700 transition-colors w-full justify-center"
                aria-label="Open filters"
              >
                <FaBars className="text-lg" />
                <span>Show Filters</span>
                <span className="bg-primary text-black px-2 py-1 rounded-full text-xs font-bold">
                  {sortedCars.length}
                </span>
              </button>
            </motion.div>

            {/* Cars Grid */}
            {sortedCars.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {sortedCars.map((car, i) => (
                    <motion.div
                      key={car._id}
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      className="group relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
                    >
                      <div className="relative h-48 overflow-hidden rounded-t-2xl">
                        <img
                          src={car.image}
                          alt={car.carModel}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 rounded-t-2xl" />

                        {/* New badge */}
                        {new Date(car.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                          <div className="absolute top-4 left-4 bg-primary text-black px-3 py-1 rounded-full text-xs font-bold z-20 select-none">
                            NEW
                          </div>
                        )}
                      </div>

                      <div className="p-6 relative z-20 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <h3
                            className="text-xl font-bold truncate"
                            title={car.carModel}
                          >
                            {car.carModel}
                          </h3>
                          <div className="flex items-center bg-gray-700 px-2 py-1 rounded select-none">
                            <FaStar className="text-yellow-400 mr-1" aria-hidden="true" />
                            <span className="font-medium">{car.rating || "4.8"}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="text-primary text-xl font-bold">
                            ${car.pricePerDay}
                            <span className="text-gray-400 text-sm">/day</span>
                          </div>
                          <div className="flex items-center text-gray-400 text-sm">
                            <FaMapMarkerAlt className="mr-1" aria-hidden="true" />
                            {car.location}
                          </div>
                        </div>

                        {/* Action button */}
                        <div className="mt-auto pt-4 border-t border-gray-700">
                          <Link
                            to={`/car-details/${car._id}`}
                            className="block w-full text-center bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-primary/40 transition-all"
                            aria-label={`Book now ${car.carModel}`}
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* Empty State */
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-7xl mb-6 animate-bounce select-none">🚗</div>
                <h3 className="text-3xl font-semibold mb-3">No cars found</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Try adjusting your search terms or filters to find your perfect ride.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Separate Filter Content Component for reusability
const FilterContent = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  clearFilters,
  sortedCars,
  availableCars,
  allCars,
}) => {
  return (
    <>
      {/* Availability Count */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-gray-800 to-gray-950 border border-gray-700 rounded-xl p-4">
          <p className="text-center text-gray-300">
            Showing{" "}
            <span className="font-bold text-primary">{sortedCars.length}</span> of{" "}
            <span className="font-bold">{availableCars.length}</span> available cars (
            {allCars.length} total in fleet)
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Search
        </label>
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by model or location..."
            className="w-full pl-12 pr-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-gray-900 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search cars by model or location"
          />
        </div>
      </div>

      {/* Sort */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Sort By
        </label>
        <select
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-gray-900 transition"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort cars"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="low-price">Price: Low to High</option>
          <option value="high-price">Price: High to Low</option>
        </select>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={clearFilters}
        className="w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-700 transition-colors font-medium"
        aria-label="Clear all filters"
      >
        Clear All Filters
      </button>
    </>
  );
};

export default AvailableCars;