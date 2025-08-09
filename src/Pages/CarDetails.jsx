import { useNavigate, useParams } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { FaCar, FaGasPump, FaMapMarkerAlt, FaStar, FaCheckCircle } from 'react-icons/fa';
import { AuthContext } from '../Provider/AuthProvider';

const CarDetails = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userBookings, setUserBookings] = useState([]);
  const alreadyBooked = userBookings.some(booking => booking.carId === id);

  useEffect(() => {
    if (user?.email) {
      fetch(`https://server-car-rental.vercel.app/bookings?email=${user.email}`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => setUserBookings(data));
    }
  }, [user]);

  useEffect(() => {
    fetch(`https://server-car-rental.vercel.app/cars/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCar(data);
        setLoading(false);
      });
  }, [id]);

  const handleBooking = async (car) => {
    const result = await Swal.fire({
      title: 'Confirm Booking',
      html: `
        <div class="text-left">
          <p class="mb-2"><strong class="text-primary">Car:</strong> ${car.carModel}</p>
          <p class="mb-2"><strong class="text-primary">Price/Day:</strong> $${car.pricePerDay}</p>
          <p class="mb-2"><strong class="text-primary">Location:</strong> ${car.location}</p>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Confirm Booking',
      confirmButtonColor: '#3B82F6',
      background: '#1F2937',
      color: '#FFFFFF'
    });

    if (result.isConfirmed) {
      const bookingInfo = {
        carId: car._id,
        carModel: car.carModel,
        pricePerDay: car.pricePerDay,
        location: car.location,
        userEmail: user?.email,
        userName: user?.displayName,
        bookingDate: new Date().toISOString(),
      };

      try {
        const response = await fetch(`https://server-car-rental.vercel.app/bookings?email=${user?.email}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingInfo),
        });

        if (!response.ok) {
          throw new Error('Failed to save booking');
        }

        await fetch(`https://server-car-rental.vercel.app/bookings/${car._id}/increment`, {
          method: 'PATCH',
        });

        await Swal.fire({
          title: 'Booked!',
          text: 'Your booking has been confirmed.',
          icon: 'success',
          confirmButtonColor: '#3B82F6',
          background: '#1F2937',
          color: '#FFFFFF'
        });
        navigate('/my-bookings');
      } catch (error) {
        console.error('Booking failed:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong while booking.',
          icon: 'error',
          confirmButtonColor: '#3B82F6',
          background: '#1F2937',
          color: '#FFFFFF'
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black text-white">
      <div className="w-11/12 mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              {car.carModel}
            </span>
          </h2>
          <div className="flex justify-center items-center gap-4">
            <div className="flex items-center bg-gray-800 px-4 py-2 rounded-full">
              <FaStar className="text-yellow-400 mr-2" />
              <span className="font-medium">{car.rating || "4.8"}</span>
            </div>
            <div className={`flex items-center px-4 py-2 rounded-full ${car.availability === "Available" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>
              {car.availability === "Available" ? (
                <>
                  <FaCheckCircle className="mr-2" />
                  Available
                </>
              ) : "Unavailable"}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Car Image */}
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-2xl overflow-hidden border border-gray-700">
              <img
                src={car.image}
                alt={car.carModel}
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="text-xl font-bold">${car.pricePerDay}<span className="text-gray-400 text-sm font-normal"> / day</span></div>
              </div>
            </div>
          </motion.div>

          {/* Car Details */}
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold mb-6 text-primary">Vehicle Details</h3>

              {/* Description */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-3 text-gray-300">Description</h4>
                <p className="text-gray-400">{car.description}</p>
              </div>

              {/* Features */}
              {Array.isArray(car.features) && car.features.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-3 text-gray-300">Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {car.features.map((feature, index) => (
                      <span key={index} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Owner Info */}
              <div className="mb-8 p-4 bg-gray-700 rounded-lg">
                <h4 className="text-lg font-semibold mb-2 text-gray-300">Owner Information</h4>
                <p className="text-gray-400"><span className="font-medium">Name:</span> {car.addedBy?.name || "Not specified"}</p>
                <p className="text-gray-400"><span className="font-medium">Contact:</span> {car.addedBy?.email || "Not specified"}</p>
              </div>

              {/* Booking Button */}
              <div className="mt-6">
                {user ? (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBooking(car)}
                    disabled={alreadyBooked || car.availability !== "Available"}
                    className={`w-full py-3 px-6 rounded-xl font-bold text-white transition-all ${alreadyBooked 
                      ? "bg-gray-600 cursor-not-allowed" 
                      : car.availability !== "Available" 
                        ? "bg-red-600 cursor-not-allowed" 
                        : "bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30"}`}
                  >
                    {alreadyBooked 
                      ? "Already Booked" 
                      : car.availability !== "Available" 
                        ? "Currently Unavailable" 
                        : "Book This Vehicle"}
                  </motion.button>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-400 mb-4">Please login to book this vehicle</p>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/login')}
                      className="bg-gradient-to-r from-primary to-secondary text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all"
                    >
                      Login to Book
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CarDetails;