import { motion } from 'framer-motion';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  // Example fetch from backend (replace with real API)
  useEffect(() => {
    fetch('http://localhost:3000/cars/')
      .then(res => res.json())
      .then(data => setBookings(data));
  }, []);

  const handleCancel = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure you want to cancel this booking?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No',
    });

    if (confirm.isConfirmed) {
      // Replace with real API request
      const updated = bookings.map(b => b._id === id ? { ...b, status: 'Canceled' } : b);
      setBookings(updated);
      toast.success('Booking canceled successfully!');
    }
  };

  const handleEdit = (id) => {
    // You can open a modal or navigate to a booking update form
    toast.info('Edit functionality coming soon...');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto px-4 py-10"
    >
      <h2 className="text-3xl font-bold mb-6 text-center">My Bookings</h2>

      <div className="overflow-x-auto">
        <table className="table w-full border border-gray-300">
          <thead className="bg-base-200 text-sm text-left">
            <tr>
              <th>Car Image</th>
              <th>Model</th>
              <th>Booking Date</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking, index) => (
              <motion.tr
                key={booking._id}
                className={`transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} hover:shadow-md`}
                whileHover={{ scale: 1.01 }}
              >
                <td>
                  <img src={booking.carImage} alt={booking.model} className="w-20 h-14 object-cover rounded" />
                </td>
                <td className="font-semibold">{booking.model}</td>
                <td>{new Date(booking.bookingDate).toLocaleString('en-GB')}</td>
                <td>${booking.totalPrice}</td>
                <td>
                  <span className={`badge ${booking.status === 'Canceled' ? 'badge-error' : 'badge-success'}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="space-x-2">
                  <button onClick={() => handleEdit(booking._id)} className="btn btn-sm btn-info">
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button onClick={() => handleCancel(booking._id)} className="btn btn-sm btn-error">
                    <FaTrash className="mr-1" /> Cancel
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <p className="text-center mt-8 text-gray-500">You have no bookings yet.</p>
        )}
      </div>
    </motion.div>
  );
};

export default MyBookings;
