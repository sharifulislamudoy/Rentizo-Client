import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { AuthContext } from '../Provider/AuthProvider';
import useScrollToTop from '../Utils/UseScrollToTop';

const AddCar = () => {
  useScrollToTop(); // Scrolls to top when component loads
  const navigate = useNavigate(); // For programmatic navigation after adding car
  const { user } = useContext(AuthContext); // Get logged-in user info from context
  const [loading, setLoading] = useState(false); // Loading state during form submission

  // Handles form submission to add a new car
  const handleAddCar = async (e) => {
    e.preventDefault(); // Prevent page refresh on form submit
    setLoading(true); // Show loading indicator

    // Extract form values
    const form = e.target;
    const carModel = form.carModel.value;
    const pricePerDay = form.pricePerDay.value;
    const availability = form.availability.value;
    const registration = form.registration.value;
    const features = form.features.value;
    const description = form.description.value;
    const image = form.image.value;
    const location = form.location.value;

    // Prepare the car object to send to server
    const newCar = {
      carModel,
      pricePerDay: parseFloat(pricePerDay), // Convert string to number
      availability,
      registration,
      features: features.split(',').map((f) => f.trim()), // Convert comma-separated string to array
      description,
      image,
      location,
      bookingCount: 0, // Default booking count
      createdAt: new Date().toISOString(), // Timestamp of creation
      addedBy: {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      },
    };

    try {
      // Send POST request to add car API
      const res = await fetch(`https://server-car-rental.vercel.app/cars?email=${user?.email}`, {
        method: 'POST',
        credentials: 'include', // Include cookies if any
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCar),
      });

      const data = await res.json();
      if (data.insertedId || res.ok) {
        toast.success('Car added successfully!', {
          duration: 1500,
        });
        setTimeout(() => {
          navigate('/my-cars');
        }, 1000);
      } else {
        throw new Error(data.message || 'Failed to add car');
      }
    } catch (err) {
      toast.error(`Error: ${err.message}`); // Show error notification if request fails
    } finally {
      setLoading(false); // Hide loading indicator no matter what
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto py-12 px-4"
    >
      <h2 className="text-3xl font-bold mb-8 text-center text-primary">Add a New Car</h2>

      <form onSubmit={handleAddCar} className="space-y-6 bg-base-200 p-6 rounded-lg shadow">
        {/* Form inputs for car details */}
        <div className="grid md:grid-cols-2 gap-4">
          <input name="carModel" required type="text" placeholder="Car Model" className="input input-bordered w-full" />
          <input name="pricePerDay" required type="number" placeholder="Daily Rental Price ($)" className="input input-bordered w-full" />
          <input name="availability" required type="text" placeholder="Availability (e.g. Available/Unavailable)" className="input input-bordered w-full" />
          <input name="registration" required type="text" placeholder="Vehicle Registration Number" className="input input-bordered w-full" />
          <input name="features" type="text" placeholder="Features (comma-separated)" className="input input-bordered w-full" />
          <input name="image" required type="url" placeholder="Image URL" className="input input-bordered w-full" />
          <input name="location" required type="text" placeholder="Location" className="input input-bordered w-full" />
          {/* Booking count is read-only, starts at 0 */}
          <input
            type="number"
            value={0}
            readOnly
            className="input input-bordered w-full"
            placeholder="Booking Count (Default 0)"
          />
        </div>

        {/* Text area for additional car description */}
        <textarea name="description" required className="textarea textarea-bordered w-full" rows="4" placeholder="Car Description"></textarea>

        {/* Submit button disables when loading */}
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? 'Adding Car...' : 'Add Car'}
        </button>
      </form>
    </motion.div>
  );
};

export default AddCar;
