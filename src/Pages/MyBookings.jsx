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
import LoadingSpinner from '../Utils/LoadingSpinner';

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:3000/bookings?email=${user.email}`, {
        // headers : {
        //   authorization: `Bearer ${user.accessToken}`
        // },
        credentials: 'include'
      })
        .then((res) => res.json())
        .then((data) => setBookings(data));
        setLoading(false);
    }
  }, [user?.email]);

  if(loading){
    return <LoadingSpinner />
  }

  const handleCancel = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure you want to cancel this booking?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:3000/bookings/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          setBookings(bookings.filter((b) => b._id !== id));
          toast.success('Booking cancelled successfully!');
        } else {
          toast.error('Failed to cancel booking.');
        }
      } catch (error) {
        toast.error('Error cancelling booking.');
      }
    }
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setStartDate(booking.startDate?.split('T')[0] || '');
    setEndDate(booking.endDate?.split('T')[0] || '');
    document.getElementById('edit_modal').showModal();
  };

  const handleUpdate = async () => {
    const res = await fetch(`http://localhost:3000/bookings/${selectedBooking._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate, endDate }),
    });

    if (res.ok) {
      const updated = bookings.map((b) =>
        b._id === selectedBooking._id
          ? { ...b, startDate, endDate }
          : b
      );
      setBookings(updated);
      toast.success('Booking updated!');
      document.getElementById('edit_modal').close();
    } else {
      toast.error('Failed to update booking.');
    }
  };

  const chartData = Array.from(
    bookings.reduce((acc, cur) => {
      const model = cur.carModel || cur.model;
      const start = new Date(cur.startDate);
      const end = new Date(cur.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
      const price = parseFloat(cur.pricePerDay || 0) * days;
      acc.set(model, (acc.get(model) || 0) + price);
      return acc;
    }, new Map()),
    ([model, price]) => ({ model, price: Number(price.toFixed(2)) })
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto px-4 py-10"
    >
      <h2 className="text-3xl font-bold mb-6 text-center">My Bookings</h2>

      <div className="overflow-x-auto space-y-7">
        {/* Chart */}
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
        <table className="table w-full border border-gray-300">
          <thead className="bg-base-200 text-sm text-left">
            <tr>
              <th>Model</th>
              <th>Booking Date</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Location</th>
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
                <td>
                  {(() => {
                    const start = new Date(booking.startDate);
                    const end = new Date(booking.endDate);
                    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
                    const pricePerDay = parseFloat(booking.pricePerDay || 0);
                    const total = (pricePerDay * days).toFixed(2);
                    return `$${total} (${days} day${days > 1 ? 's' : ''})`;
                  })()}
                </td>
                <td>
                  <span
                    className={`badge ${booking.status === 'Canceled'
                      ? 'badge-error'
                      : booking.status === 'Pending'
                        ? 'badge-warning'
                        : 'badge-success'
                      }`}
                  >
                    {booking.status || 'Confirmed'}
                  </span>
                </td>
                <td>{booking.location}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => handleEdit(booking)}
                    className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <FaEdit className="mr-1" /> Modify Date
                  </button>

                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="btn btn-sm bg-red-500 hover:bg-red-600 text-white"
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

      {/* Modal for Date Update */}
      <dialog id="edit_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Modify Booking Dates</h3>

          <label className="label">
            <span className="label-text">Start Date</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input input-bordered w-full mb-2"
          />

          <label className="label">
            <span className="label-text">End Date</span>
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input input-bordered w-full"
          />

          {/* Total Price Preview */}
          {startDate && endDate && selectedBooking?.pricePerDay && (
            <div className="mt-4 p-3 rounded bg-base-200 text-sm text-gray-700">
              {(() => {
                const start = new Date(startDate);
                const end = new Date(endDate);
                const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
                const pricePerDay = parseFloat(selectedBooking.pricePerDay || 0);
                const total = (pricePerDay * days).toFixed(2);
                return (
                  <p>
                    <strong>Total Days:</strong> {days} <br />
                    <strong>Price per Day:</strong> ${pricePerDay} <br />
                    <strong>Total Price:</strong> ${total}
                  </p>
                );
              })()}
            </div>
          )}

          <div className="modal-action">
            <button onClick={handleUpdate} className="btn btn-primary">
              Save
            </button>
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>

    </motion.div>
  );
};

export default MyBookings;
