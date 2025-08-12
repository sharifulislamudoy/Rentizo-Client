import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { AuthContext } from '../Provider/AuthProvider';
import useScrollToTop from '../Utils/UseScrollToTop';
import LoadingSpinner from '../Utils/LoadingSpinner';
import { FiEdit, FiTrash2, FiPlus, FiFilter, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { FaCar, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const MyCars = () => {
  useScrollToTop();
  const { user } = useContext(AuthContext);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCar, setEditingCar] = useState(null);
  const [sortOption, setSortOption] = useState('date-newest');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch user's cars
  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:3000/cars/by-email?email=${user.email}`, {
        credentials: 'include'
      })
        .then((res) => res.json())
        .then((data) => {
          let sortedData = [...data];
          if (sortOption === 'date-newest') {
            sortedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          } else if (sortOption === 'date-oldest') {
            sortedData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          } else if (sortOption === 'price-lowest') {
            sortedData.sort((a, b) => a.pricePerDay - b.pricePerDay);
          } else if (sortOption === 'price-highest') {
            sortedData.sort((a, b) => b.pricePerDay - a.pricePerDay);
          }
          setCars(sortedData);
          setLoading(false);
        })
        .catch(() => toast.error('Failed to load your cars. Please try again later.'));
    }
  }, [user, sortOption]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;

    const updatedCar = {
      carModel: form.carModel.value,
      pricePerDay: parseFloat(form.pricePerDay.value),
      availability: form.availability.value,
      registration: form.registration.value,
      features: form.features.value.split(',').map(f => f.trim()),
      description: form.description.value,
      image: form.image.value,
      location: form.location.value,
    };

    const result = await Swal.fire({
      title: "Save Changes?",
      text: "Are you sure you want to update this car listing?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Save Changes",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        confirmButton: 'bg-primary hover:bg-primary-dark',
        cancelButton: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
      }
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:3000/cars/${editingCar._id}?email=${user?.email}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedCar),
        });

        if (res.ok) {
          toast.success('Car updated successfully!');
          setCars((prev) =>
            prev.map((car) => (car._id === editingCar._id ? { ...car, ...updatedCar } : car))
          );
          setIsModalOpen(false);
          setEditingCar(null);
        } else {
          throw new Error('Update failed');
        }
      } catch {
        toast.error('Failed to update car');
      }
    }
  };

  // Handle delete
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Car?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        confirmButton: 'bg-red-600 hover:bg-red-700',
        cancelButton: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:3000/cars/${id}?email=${user?.email}`, {
            method: 'DELETE',
            credentials: 'include',
          });
          if (res.ok) {
            setCars((prev) => prev.filter((car) => car._id !== id));
            toast.success('Car deleted successfully!');
          } else {
            throw new Error();
          }
        } catch {
          toast.error('Failed to delete car');
        }
      }
    });
  };

  if (!cars.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6"
      >
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-2xl max-w-md w-full">
          <FaCar className="text-5xl mx-auto text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-4">No Cars Listed Yet</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You haven't added any cars to your profile. Start earning by listing your vehicle today!
          </p>
          <Link
            to="/add-car"
            className="btn btn-primary rounded-full px-6 py-3 flex items-center gap-2 w-fit mx-auto"
          >
            <FiPlus /> Add Your First Car
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className='bg-black'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className=" mx-auto px-4 py-8 w-11/12"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Car Listings</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your {cars.length} listed {cars.length === 1 ? 'vehicle' : 'vehicles'}
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="date-newest">Newest First</option>
                <option value="date-oldest">Oldest First</option>
                <option value="price-lowest">Price: Low to High</option>
                <option value="price-highest">Price: High to Low</option>
              </select>
              <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>

            <Link
              to="/add-car"
              className="btn btn-primary rounded-lg px-4 py-2 flex items-center gap-2"
            >
              <FiPlus /> Add New
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <motion.div
              key={car._id}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300"
            >
              <div className="relative h-48">
                <img
                  src={car.image}
                  alt={car.carModel}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingCar(car);
                      setIsModalOpen(true);
                    }}
                    className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Edit car"
                  >
                    <FiEdit className="text-primary" />
                  </button>
                  <button
                    onClick={() => handleDelete(car._id)}
                    className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Delete car"
                  >
                    <FiTrash2 className="text-red-500" />
                  </button>
                </div>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                    {car.carModel}
                  </h3>
                  <span className="bg-primary bg-opacity-10 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ${car.pricePerDay}/day
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <FaCar className="mr-1" />
                  <span className="mr-3">{car.registration}</span>
                  {car.availability?.toLowerCase() === 'available' ? (
                    <span className="flex items-center text-green-600 dark:text-green-400">
                      <FaCheckCircle className="mr-1" /> Available
                    </span>
                  ) : (
                    <span className="flex items-center text-red-600 dark:text-red-400">
                      <FaTimesCircle className="mr-1" /> Unavailable
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {car.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                  {car.features.length > 3 && (
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded">
                      +{car.features.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <FiCalendar className="mr-1" />
                    {new Date(car.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm font-medium">
                    <span className="text-primary">{car.bookingCount || 0}</span> bookings
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Car Details</h3>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingCar(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Car Model
                      </label>
                      <input
                        name="carModel"
                        defaultValue={editingCar.carModel}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Price Per Day ($)
                      </label>
                      <input
                        name="pricePerDay"
                        defaultValue={editingCar.pricePerDay}
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Availability
                      </label>
                      <select
                        name="availability"
                        defaultValue={editingCar.availability}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      >
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                        <option value="maintenance">Under Maintenance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Registration Number
                      </label>
                      <input
                        name="registration"
                        defaultValue={editingCar.registration}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Features (comma separated)
                      </label>
                      <input
                        name="features"
                        defaultValue={editingCar.features.join(', ')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Image URL
                      </label>
                      <input
                        name="image"
                        defaultValue={editingCar.image}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location
                      </label>
                      <input
                        name="location"
                        defaultValue={editingCar.location}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        defaultValue={editingCar.description}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setEditingCar(null);
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MyCars;