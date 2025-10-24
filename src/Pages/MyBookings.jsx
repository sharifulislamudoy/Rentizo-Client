import { motion } from 'framer-motion';
import { FaTrash, FaEdit, FaCalendarAlt, FaCar, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Provider/AuthProvider';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import LoadingSpinner from '../Utils/LoadingSpinner';
import { ReTitle } from 're-title';
import { useNavigate } from 'react-router';

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (user?.email) {
      fetch(`https://rentizo-server.vercel.app/bookings?email=${user.email}`, {
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((data) => {
          setBookings(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user?.email]);

  const handleCancel = async (id) => {
    const confirm = await Swal.fire({
      title: 'Cancel Booking?',
      text: 'Are you sure you want to cancel this booking?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'No, keep it',
      background: '#1f2937',
      color: '#fff',
      confirmButtonColor: '#ef4444',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(
          `https://rentizo-server.vercel.app/bookings/${id}?email=${user?.email}`,
          {
            method: 'DELETE',
            credentials: 'include',
          }
        );

        if (res.ok) {
          setBookings(bookings.filter((b) => b._id !== id));
          toast.success('Booking cancelled successfully!', {
            position: 'top-right',
            theme: 'dark',
          });
        } else {
          toast.error('Failed to cancel booking.', {
            position: 'top-right',
            theme: 'dark',
          });
        }
      } catch {
        toast.error('Error cancelling booking.', {
          position: 'top-right',
          theme: 'dark',
        });
      }
    }
  };

  const handleEdit = (booking) => {
    const todayStr = getTodayString();
    const tomorrowStr = getTomorrowString();

    setSelectedBooking(booking);

    setStartDate(
      booking.startDate && !isNaN(new Date(booking.startDate).getTime())
        ? new Date(booking.startDate).toISOString().split('T')[0]
        : todayStr
    );

    setEndDate(
      booking.endDate && !isNaN(new Date(booking.endDate).getTime())
        ? new Date(booking.endDate).toISOString().split('T')[0]
        : tomorrowStr
    );

    document.getElementById('edit_modal').showModal();
  };

  const handleUpdate = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select valid dates.', {
        position: 'top-right',
        theme: 'dark',
      });
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error('Start date cannot be after end date.', {
        position: 'top-right',
        theme: 'dark',
      });
      return;
    }

    const res = await fetch(
      `https://rentizo-server.vercel.app/bookings/${selectedBooking._id}?email=${user?.email}`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate }),
      }
    );

    if (res.ok) {
      const updated = bookings.map((b) =>
        b._id === selectedBooking._id ? { ...b, startDate, endDate } : b
      );
      setBookings(updated);
      toast.success('Booking updated!', {
        position: 'top-right',
        theme: 'dark',
      });
      document.getElementById('edit_modal').close();
    } else {
      toast.error('Failed to update booking.', {
        position: 'top-right',
        theme: 'dark',
      });
    }
  };

  // Helpers for date defaults & formatting
  const getTodayString = () => new Date().toISOString().split('T')[0];

  const getTomorrowString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const formatDateSafeWithFallback = (date, fallback) => {
    if (!date) {
      if (fallback === 'today') return new Date().toLocaleDateString();
      if (fallback === 'tomorrow') {
        const t = new Date();
        t.setDate(t.getDate() + 1);
        return t.toLocaleDateString();
      }
      return 'N/A';
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      if (fallback === 'today') return new Date().toLocaleDateString();
      if (fallback === 'tomorrow') {
        const t = new Date();
        t.setDate(t.getDate() + 1);
        return t.toLocaleDateString();
      }
      return 'N/A';
    }
    return d.toLocaleDateString();
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return 1;
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) return 1;

    const diff = Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const calculateTotalPrice = (pricePerDay, days) => {
    const price = parseFloat(pricePerDay);
    if (isNaN(price) || price <= 0) return 'N/A';
    return `$${(price * days).toFixed(2)}`;
  };

  const chartData = Array.from(
    bookings.reduce((acc, cur) => {
      const model = cur.carModel || cur.model || 'Unknown';
      const days = calculateDays(cur.startDate, cur.endDate);
      const pricePerDay = parseFloat(cur.pricePerDay || 0);
      const totalPrice = pricePerDay > 0 ? pricePerDay * days : 0;
      acc.set(model, (acc.get(model) || 0) + totalPrice);
      return acc;
    }, new Map()),
    ([model, price]) => ({ model, price: Number(price.toFixed(2)) })
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className='bg-black'>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <ReTitle title="Rentizo | My Bookings" />

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            My Bookings
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Manage your current and upcoming car rentals
          </p>
        </div>

        {bookings.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Analytics Section */}
            <div className="lg:w-1/2 bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-xl">
              <h3 className="text-2xl font-semibold mb-6 text-primary">
                Booking Analytics
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="model" tick={{ fill: '#9ca3af' }} tickMargin={10} />
                    <YAxis
                      tick={{ fill: '#9ca3af' }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#111827',
                        borderColor: '#374151',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value) => [`$${value}`, 'Total Price']}
                      labelStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="price" fill="url(#colorPrice)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bookings List */}
            <div className="lg:w-1/2">
              <h3 className="text-2xl font-semibold text-primary mb-6">Your Bookings</h3>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {bookings.map((booking) => {
                  const days = calculateDays(booking.startDate, booking.endDate);
                  const totalPrice = calculateTotalPrice(booking.pricePerDay, days);

                  return (
                    <motion.div
                      key={booking._id}
                      whileHover={{ y: -5 }}
                      className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-lg hover:shadow-xl transition-all"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-white">
                            {booking.carModel || booking.model || 'Unknown Model'}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'Canceled'
                                ? 'bg-red-900 text-red-200'
                                : booking.status === 'Pending'
                                  ? 'bg-yellow-900 text-yellow-200'
                                  : booking.status === 'Confirmed'
                                    ? 'bg-green-900 text-green-200'
                                    : 'bg-gray-800 text-gray-200'
                              }`}
                          >
                            {booking.status || 'Confirmed'}
                          </span>

                        </div>

                        <div className="space-y-3 text-gray-300">
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-3 text-primary" />
                            <span>
                              {formatDateSafeWithFallback(booking.startDate, 'today')} -{' '}
                              {formatDateSafeWithFallback(booking.endDate, 'tomorrow')}
                            </span>
                          </div>

                          <div className="flex items-center">
                            <FaDollarSign className="mr-3 text-primary" />
                            <span>
                              {totalPrice !== 'N/A'
                                ? `${totalPrice} (${days} day${days > 1 ? 's' : ''})`
                                : 'N/A'}
                            </span>
                          </div>

                          <div className="flex items-center">
                            <FaMapMarkerAlt className="mr-3 text-primary" />
                            <span>{booking.pickupLocation.address || 'Unknown Location'}</span>
                          </div>
                        </div>

                        <div className="mt-6 flex space-x-3">
                          <button
                            onClick={() => handleEdit(booking)}
                            className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium flex items-center justify-center transition"
                          >
                            <FaEdit className="mr-2" /> Modify
                          </button>

                          <button
                            onClick={() => handleCancel(booking._id)}
                            className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium flex items-center justify-center transition"
                          >
                            <FaTrash className="mr-2" /> Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-900 rounded-2xl border border-gray-800">
            <div className="max-w-md mx-auto">
              <FaCar className="mx-auto text-5xl text-gray-600 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-300 mb-2">No Bookings Yet</h3>
              <p className="text-gray-500 mb-6">
                You haven't made any bookings yet. Start exploring our fleet to find your perfect
                ride.
              </p>
              <button
                onClick={() => navigate('/available-cars')}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg font-medium text-white hover:opacity-90 transition-opacity"
              >
                Browse Available Cars
              </button>
            </div>
          </div>
        )}

        {/* Edit Booking Modal */}
        <dialog id="edit_modal" className="modal">
          <div className="modal-box bg-gray-900 border border-gray-800 max-w-md">
            <h3 className="font-bold text-xl mb-6 text-primary">Modify Booking Dates</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate || getTodayString()}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 text-white transition"
                  min={getTodayString()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate || getTomorrowString()}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/50 text-white transition"
                  min={startDate || getTodayString()}
                />
              </div>

              {startDate && endDate && selectedBooking?.pricePerDay && (
                <div className="mt-4 p-4 rounded-lg bg-gray-800 border border-gray-700">
                  <h4 className="font-medium text-gray-300 mb-2">Booking Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-400">Start Date:</div>
                    <div>{formatDateSafeWithFallback(startDate, 'today')}</div>

                    <div className="text-gray-400">End Date:</div>
                    <div>{formatDateSafeWithFallback(endDate, 'tomorrow')}</div>

                    <div className="text-gray-400">Days:</div>
                    <div>{calculateDays(startDate, endDate)}</div>

                    <div className="text-gray-400">Price per Day:</div>
                    <div>${parseFloat(selectedBooking.pricePerDay || 0).toFixed(2)}</div>

                    <div className="text-gray-400 font-medium">Total:</div>
                    <div className="font-medium text-primary">
                      $
                      {(
                        parseFloat(selectedBooking.pricePerDay || 0) *
                        calculateDays(startDate, endDate)
                      ).toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-action mt-6">
              <button
                onClick={handleUpdate}
                className="px-6 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg font-medium text-white hover:opacity-90 transition-opacity"
              >
                Update Booking
              </button>
              <form method="dialog">
                <button className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium text-white transition">
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </motion.div>
    </div>
  );
};

export default MyBookings;
