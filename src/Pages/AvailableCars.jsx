import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import useScrollToTop from '../Utils/UseScrollToTop';

const AvailableCars = () => {
  useScrollToTop();
  const [cars, setCars] = useState([]);
  const [view, setView] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/cars/')
      .then((res) => res.json())
      .then((data) => {
        const availableCars = data.filter(car => car.availability === "Available");
        setCars(availableCars);
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

  const filteredCars = cars.filter((car) => {
    const search = searchTerm.toLowerCase();
    return (
      car.carModel.toLowerCase().includes(search) ||
      car.location?.toLowerCase().includes(search)
    );
  });
  const sortedCars = sortCars(filteredCars);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 min-h-screen w-11/12 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold">Available Cars</h2>
        <div className="flex items-center gap-2">
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

      {view === 'grid' ? (
        <div className="grid md:grid-cols-3 gap-6">
          {sortedCars.map((car) => (
            <motion.div
              key={car._id}
              className="card bg-base-100 shadow-xl"
              whileHover={{ scale: 1.03 }}
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
        </div>
      ) : (
        <div className="space-y-4">
          {sortedCars.map((car) => (
            <motion.div
              key={car._id}
              className="flex flex-col md:flex-row items-center gap-4 p-4 border rounded-lg shadow"
              whileHover={{ scale: 1.01 }}
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
        </div>
      )}
    </motion.div>
  );
};

export default AvailableCars;
