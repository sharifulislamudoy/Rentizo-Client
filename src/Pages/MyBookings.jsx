import { motion } from 'framer-motion';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Provider/AuthProvider';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editedLocation, setEditedLocation] = useState('');



  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:3000/bookings?email=${user.email}`)
        .then((res) => res.json())
        .then((data) => setBookings(data));
    }
  }, [user?.email]);

  const handleCancel = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure you want to cancel this booking?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:3000/bookings/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          setBookings(bookings.filter((b) => b._id !== id)); // UI remove
          toast.success('Booking deleted successfully!');
        } else {
          toast.error('Failed to delete booking.');
        }
      } catch (error) {
        toast.error('Error deleting booking.');
      }
    }
  };



  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setEditedLocation(booking.location || '');
    document.getElementById('edit_modal').showModal();
  };

  const handleUpdate = async () => {
    const res = await fetch(`http://localhost:3000/bookings/${selectedBooking._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location: editedLocation }),
    });

    if (res.ok) {
      const updated = bookings.map((b) =>
        b._id === selectedBooking._id ? { ...b, location: editedLocation } : b
      );
      setBookings(updated);
      toast.success('Booking updated!');
      document.getElementById('edit_modal').close();
    } else {
      toast.error('Failed to update booking.');
    }
  };


  // Aggregate price by model for chart
  const chartData = Array.from(
    bookings.reduce((acc, cur) => {
      const model = cur.carModel || cur.model;
      const price = parseFloat(cur.totalPrice || cur.pricePerDay);
      acc.set(model, (acc.get(model) || 0) + price);
      return acc;
    }, new Map()),
    ([model, price]) => ({ model, price })
  );

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
              <th>Model</th>
              <th>Booking Date</th>
              <th>Total Price</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking, index) => (
              <motion.tr
                key={booking._id}
                className={`transition-colors ${index % 2 === 0 ? 'bg-base-100' : 'bg-base-200'
                  } hover:shadow-md`}
                whileHover={{ scale: 1.01 }}
              >
                <td className="font-semibold">
                  {booking.carModel || booking.model}
                </td>
                <td>{new Date(booking.bookingDate).toLocaleString('en-GB')}</td>
                <td>${booking.totalPrice || booking.pricePerDay}</td>
                <td>{booking.location}</td>
                <td>
                  <span
                    className={`badge ${booking.status === 'Canceled'
                      ? 'badge-error'
                      : 'badge-success'
                      }`}
                  >
                    {booking.status || 'Confirmed'}
                  </span>
                </td>
                <td className="space-x-2">
                  <button
                    onClick={() => handleEdit(booking)}
                    className="btn btn-sm btn-info"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>

                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="btn btn-sm btn-error"
                  >
                    <FaTrash className="mr-1" /> Cancel
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <p className="text-center mt-8 text-gray-500">
            You have no bookings yet.
          </p>
        )}
      </div>
      <dialog id="edit_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Edit Booking</h3>
          <label className="label">
            <span className="label-text">Location</span>
          </label>
          <input
            type="text"
            value={editedLocation}
            onChange={(e) => setEditedLocation(e.target.value)}
            className="input input-bordered w-full"
          />
          <div className="modal-action">
            <button onClick={handleUpdate} className="btn btn-primary">Save</button>
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>


      {/* Chart Section */}
      {bookings.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-4 text-center">
            Total Rental Price by Car Model
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="model" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="price" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default MyBookings;
