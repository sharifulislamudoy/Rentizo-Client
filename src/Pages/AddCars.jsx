import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { AuthContext } from '../Provider/AuthProvider';
import useScrollToTop from '../Utils/UseScrollToTop';
// import { useAuth } from '../../hooks/useAuth'; // Custom hook that returns user info

const AddCar = () => {
    useScrollToTop();
  const navigate = useNavigate();
//   const { user } = useAuth(); // Must return logged in user's name, email, photo
const {user} = useContext(AuthContext)
  const [loading, setLoading] = useState(false);

  const handleAddCar = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const carModel = form.carModel.value;
    const pricePerDay = form.pricePerDay.value;
    const availability = form.availability.value;
    const registration = form.registration.value;
    const features = form.features.value;
    const description = form.description.value;
    const image = form.image.value;
    const location = form.location.value;

    const newCar = {
      carModel,
      pricePerDay: parseFloat(pricePerDay),
      availability,
      registration,
      features: features.split(',').map((f) => f.trim()),
      description,
      image,
      location,
      bookingCount: 0,
      createdAt: new Date().toISOString(),
      addedBy: {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      },
    };

    try {
      const res = await fetch('https://your-api-url.com/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCar),
      });

      const data = await res.json();

      if (data.insertedId || res.ok) {
        toast.success('Car added successfully!');
        navigate('/my-cars');
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
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto py-12 px-4"
    >
      <h2 className="text-3xl font-bold mb-8 text-center text-primary">Add a New Car</h2>

      <form onSubmit={handleAddCar} className="space-y-6 bg-base-200 p-6 rounded-lg shadow">
        <div className="grid md:grid-cols-2 gap-4">
          <input name="carModel" required type="text" placeholder="Car Model" className="input input-bordered w-full" />
          <input name="pricePerDay" required type="number" placeholder="Daily Rental Price ($)" className="input input-bordered w-full" />
          <input name="availability" required type="text" placeholder="Availability (e.g. Available/Unavailable)" className="input input-bordered w-full" />
          <input name="registration" required type="text" placeholder="Vehicle Registration Number" className="input input-bordered w-full" />
          <input name="features" type="text" placeholder="Features (comma-separated)" className="input input-bordered w-full" />
          <input name="image" required type="url" placeholder="Image URL" className="input input-bordered w-full" />
          <input name="location" required type="text" placeholder="Location" className="input input-bordered w-full" />
        </div>

        <textarea name="description" required className="textarea textarea-bordered w-full" rows="4" placeholder="Car Description"></textarea>

        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? 'Adding Car...' : 'Add Car'}
        </button>
      </form>
    </motion.div>
  );
};

export default AddCar;
