import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { AuthContext } from '../Provider/AuthProvider';
import useScrollToTop from '../Utils/UseScrollToTop';
import LoadingSpinner from '../Utils/LoadingSpinner';

const MyCars = () => {
  useScrollToTop(); // Scroll page to top when component loads

  const { user } = useContext(AuthContext); // Get logged-in user info
  const [cars, setCars] = useState([]); // Store cars data
  const [loading, setLoading] = useState(true); // Loading state while fetching data
  const [editingCar, setEditingCar] = useState(null); // Car currently being edited
  const [sortOption, setSortOption] = useState(''); // Sort option selected by user

  // Fetch cars owned by the logged-in user, and sort them based on sortOption
  useEffect(() => {
    if (user?.email) {
      fetch(`https://rentizo-server.vercel.app/cars/by-email?email=${user.email}`, {
        credentials: 'include',
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
    return <LoadingSpinner />; // Show spinner while loading
  }

  // Update car data when user submits the edit form
  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;

    // Prepare updated car data from form inputs
    const updatedCar = {
      carModel: form.carModel.value,
      pricePerDay: parseFloat(form.pricePerDay.value),
      availability: form.availability.value,
      registration: form.registration.value,
      features: form.features.value.split(',').map((f) => f.trim()),
      description: form.description.value,
      image: form.image.value,
      location: form.location.value,
    };

    // Confirm with user before saving changes
    const result = await Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(
          `https://rentizo-server.vercel.app/cars/${editingCar._id}?email=${user?.email}`,
          {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedCar),
          }
        );

        if (res.ok) {
          toast.success('Car updated successfully!');
          // Update cars state with new data for the edited car
          setCars((prev) =>
            prev.map((car) => (car._id === editingCar._id ? { ...car, ...updatedCar } : car))
          );
          setEditingCar(null); // Close the edit modal
          Swal.fire('Saved!', '', 'success');
        } else {
          throw new Error('Update failed');
        }
      } catch {
        toast.error('Failed to update car');
      }
    } else if (result.isDenied) {
      Swal.fire('Changes are not saved', '', 'info');
    }
  };

  // Delete a car after user confirmation
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently remove the car.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`https://rentizo-server.vercel.app/cars/${id}?email=${user?.email}`, {
            method: 'DELETE',
            credentials: 'include',
          });
          if (res.ok) {
            // Remove deleted car from state to update UI
            setCars((prev) => prev.filter((car) => car._id !== id));
            toast.success('Car deleted!');
          } else {
            throw new Error();
          }
        } catch {
          toast.error('Failed to delete car');
        }
      }
    });
  };

  // Show message if user has no cars added yet
  if (!cars.length) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
        <h2 className="text-3xl font-bold mb-4">You haven't added any cars yet.</h2>
        <Link to="/add-car" className="btn btn-primary">
          Add Your First Car
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">My Cars</h2>

      {/* Sorting dropdown */}
      <div className="flex justify-end mb-4 w-11/12 mx-auto">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="select select-bordered max-w-xs"
        >
          <option value="">Sort By</option>
          <option value="date-newest">Date Added (Newest First)</option>
          <option value="date-oldest">Date Added (Oldest First)</option>
          <option value="price-lowest">Price (Lowest First)</option>
          <option value="price-highest">Price (Highest First)</option>
        </select>
      </div>

      {/* Table listing all cars */}
      <div className="overflow-x-auto w-11/12 mx-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Image</th>
              <th>Model</th>
              <th>Price/Day</th>
              <th>Bookings</th>
              <th>Availability</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car._id}>
                <td>
                  <img src={car.image} alt={car.carModel} className="w-16 h-10 rounded" />
                </td>
                <td>{car.carModel}</td>
                <td>${car.pricePerDay}</td>
                <td>{car.bookingCount}</td>
                <td>{car.availability}</td>
                <td>{new Date(car.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => setEditingCar(car)}
                    className="btn btn-sm btn-warning mr-2"
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(car._id)} className="btn btn-sm btn-error">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal dialog for editing a car */}
      {editingCar && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Edit Car</h3>
            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                name="carModel"
                defaultValue={editingCar.carModel}
                required
                className="input input-bordered w-full"
              />
              <input
                name="pricePerDay"
                defaultValue={editingCar.pricePerDay}
                required
                className="input input-bordered w-full"
                type="number"
              />
              <input
                name="availability"
                defaultValue={editingCar.availability}
                required
                className="input input-bordered w-full"
              />
              <input
                name="registration"
                defaultValue={editingCar.registration}
                required
                className="input input-bordered w-full"
              />
              <input
                name="features"
                defaultValue={editingCar.features.join(', ')}
                className="input input-bordered w-full"
              />
              <input
                name="image"
                defaultValue={editingCar.image}
                className="input input-bordered w-full"
              />
              <input
                name="location"
                defaultValue={editingCar.location}
                className="input input-bordered w-full"
              />
              <textarea
                name="description"
                defaultValue={editingCar.description}
                className="textarea textarea-bordered w-full"
                rows="3"
              />
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
                <button type="button" onClick={() => setEditingCar(null)} className="btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </motion.div>
  );
};

export default MyCars;
