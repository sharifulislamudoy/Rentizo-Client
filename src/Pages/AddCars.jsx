import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { AuthContext } from '../Provider/AuthProvider';
import useScrollToTop from '../Utils/UseScrollToTop';
import { ReTitle } from 're-title';

const AddCar = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedTransmission, setSelectedTransmission] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('');

  const carTypes = ['Sedan', 'SUV', 'Coupe', 'Convertible', 'Hatchback', 'Pickup', 'Van', 'Wagon'];
  const transmissionTypes = ['Automatic', 'Manual', 'Semi-Automatic', 'CVT'];
  const fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];

  const handleAddCar = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const features = form.features.value.split(',').map(f => f.trim());

    const newCar = {
      carModel: form.carModel.value,
      pricePerDay: parseFloat(form.pricePerDay.value),
      availability: "Available", // Default value
      registration: form.registration.value,
      features,
      description: form.description.value,
      image: form.image.value,
      location: form.location.value,
      type: selectedType,
      transmission: selectedTransmission,
      fuel: selectedFuel,
      seats: parseInt(form.seats.value),
      engine: form.engine.value,
      horsepower: parseInt(form.horsepower.value),
      mph: parseFloat(form.mph.value),
      topSpeed: parseFloat(form.topSpeed.value),
      length: parseFloat(form.length.value),
      width: parseFloat(form.width.value),
      height: parseFloat(form.height.value),
      weight: parseFloat(form.weight.value),
      bookingCount: 0, // Default value
      createdAt: new Date().toISOString(),
      addedBy: {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      },
    };

    try {
      const res = await fetch(`https://server-car-rental.vercel.app/cars?email=${user?.email}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCar),
      });

      const data = await res.json();
      if (data.insertedId || res.ok) {
        toast.success('Car added successfully!', { duration: 1500 });
        setTimeout(() => navigate('/my-cars'), 1000);
      } else {
        throw new Error(data.message || 'Failed to add car');
      }
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-black'>
      <ReTitle title='Rentizo | Add Car' />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-11/12 mx-auto py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Add Your Vehicle
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            List your car on Rentizo and start earning from your idle vehicle
          </p>
        </div>

        <form onSubmit={handleAddCar} className="bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-primary border-b border-gray-800 pb-2">
                Basic Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Car Model</label>
                <input
                  name="carModel"
                  required
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 text-white transition"
                  placeholder="e.g., Toyota Camry 2023"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Daily Rental Price ($)</label>
                <input
                  name="pricePerDay"
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 text-white transition"
                  placeholder="e.g., 59.99"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Vehicle Registration Number</label>
                <input
                  name="registration"
                  required
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 text-white transition"
                  placeholder="e.g., ABC1234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Features (comma separated)</label>
                <input
                  name="features"
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 text-white transition"
                  placeholder="e.g., GPS, Bluetooth, Sunroof, Heated Seats"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
                <input
                  name="image"
                  required
                  type="url"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 text-white transition"
                  placeholder="https://example.com/car-image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                <input
                  name="location"
                  required
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 text-white transition"
                  placeholder="e.g., New York, NY"
                />
              </div>
            </div>

            {/* Specifications Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-primary border-b border-gray-800 pb-2">
                Specifications
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Car Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 text-white transition"
                >
                  <option value="">Select car type</option>
                  {carTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Transmission</label>
                <select
                  value={selectedTransmission}
                  onChange={(e) => setSelectedTransmission(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 text-white transition"
                >
                  <option value="">Select transmission</option>
                  {transmissionTypes.map((trans) => (
                    <option key={trans} value={trans}>{trans}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Fuel Type</label>
                <select
                  value={selectedFuel}
                  onChange={(e) => setSelectedFuel(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 text-white transition"
                >
                  <option value="">Select fuel type</option>
                  {fuelTypes.map((fuel) => (
                    <option key={fuel} value={fuel}>{fuel}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Seats</label>
                  <input
                    name="seats"
                    required
                    type="number"
                    min="1"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 text-white transition"
                    placeholder="e.g., 5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Horsepower</label>
                  <input
                    name="horsepower"
                    required
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 text-white transition"
                    placeholder="e.g., 200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">0-60 mph (seconds)</label>
                  <input
                    name="mph"
                    required
                    type="number"
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 text-white transition"
                    placeholder="e.g., 6.2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Top Speed (mph)</label>
                  <input
                    name="topSpeed"
                    required
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 text-white transition"
                    placeholder="e.g., 130"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Engine</label>
                <input
                  name="engine"
                  required
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 text-white transition"
                  placeholder="e.g., 2.5L 4-cylinder"
                />
              </div>
            </div>

            {/* Dimensions Section */}
            <div className="space-y-6 md:col-span-2">
              <h3 className="text-xl font-semibold text-primary border-b border-gray-800 pb-2">
                Dimensions
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Length (inches)</label>
                  <input
                    name="length"
                    required
                    type="number"
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 text-white transition"
                    placeholder="e.g., 192.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Width (inches)</label>
                  <input
                    name="width"
                    required
                    type="number"
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 text-white transition"
                    placeholder="e.g., 72.4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Height (inches)</label>
                  <input
                    name="height"
                    required
                    type="number"
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 text-white transition"
                    placeholder="e.g., 56.9"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Weight (lbs)</label>
                  <input
                    name="weight"
                    required
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 text-white transition"
                    placeholder="e.g., 3300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 text-white transition"
                  placeholder="Provide a detailed description of your vehicle..."
                ></textarea>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'List Your Car'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddCar;