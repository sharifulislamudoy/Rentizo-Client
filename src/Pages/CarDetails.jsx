import { useNavigate, useParams } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import useScrollToTop from '../Utils/UseScrollToTop';
import { AuthContext } from '../Provider/AuthProvider';

const CarDetails = () => {
  useScrollToTop(); // Scroll to top on component load

  const { user } = useContext(AuthContext); // Get current user from context
  const navigate = useNavigate(); // For programmatic navigation
  const { id } = useParams(); // Get car ID from URL params

  const [car, setCar] = useState(null); // Car data state
  const [loading, setLoading] = useState(true); // Loading state
  const [userBookings, setUserBookings] = useState([]); // User's existing bookings

  // Check if user already booked this car
  const alreadyBooked = userBookings.some(booking => booking.carId === id);

  // Fetch user bookings when user changes (to check if they already booked)
  useEffect(() => {
    if (user?.email) {
      fetch(`https://rentizo-server.vercel.app/bookings?email=${user.email}`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => setUserBookings(data));
    }
  }, [user]);

  // Fetch car details by ID from backend
  useEffect(() => {
    fetch(`https://rentizo-server.vercel.app/cars/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCar(data);
        setLoading(false);
      });
  }, [id]);

  // Handle booking process after user confirmation
  const handleBooking = async (car) => {
    // Show confirmation popup with car details
    const result = await Swal.fire({
      title: 'Confirm Booking',
      html: `
        <p><strong>Car:</strong> ${car.carModel}</p>
        <p><strong>Price/Day:</strong> $${car.pricePerDay}</p>
        <p><strong>Location:</strong> ${car.location}</p>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
    });

    // If user confirms booking
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
        // Save booking info to server
        const response = await fetch(`https://rentizo-server.vercel.app/bookings?email=${user?.email}`, {
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

        // Increment car's booking count or availability on backend
        await fetch(`https://rentizo-server.vercel.app/bookings/${car._id}/increment`, {
          method: 'PATCH',
        });

        // Notify user of successful booking and redirect to "My Bookings"
        await Swal.fire('Booked!', 'Your booking has been confirmed.', 'success');
        navigate('/my-bookings');
      } catch (error) {
        console.error('Booking failed:', error);
        Swal.fire('Error!', 'Something went wrong while booking.', 'error');
      }
    }
  };

  // Show loading indicator while data is loading
  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="p-6 max-w-5xl mx-auto"
    >
      <div className="grid md:grid-cols-2 gap-6">

        {/* Car image with animation */}
        <motion.img
          src={car.image}
          alt={car.carModel}
          className="w-full h-72 object-cover rounded shadow"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />

        {/* Car details with animation */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-4">{car.carModel}</h2>
          <p className="text-lg mb-2"><strong>Price Per Day:</strong> ${car.pricePerDay}</p>
          <p className="text-lg mb-2"><strong>Availability:</strong> {car.availability}</p>
          <p className="text-lg mb-2"><strong>Location:</strong> {car.location}</p>
          <p className="text-lg mb-2"><strong>Registration Number:</strong> {car.registration}</p>
          <p className="text-sm text-gray-600 mt-2">
            <strong>Listed by:</strong> {car.addedBy?.name} ({car.addedBy?.email})
          </p>

          {/* Features list */}
          <div className="mt-4">
            <h4 className="font-semibold mb-1">Features:</h4>
            <ul className="list-disc list-inside text-gray-700">
              {Array.isArray(car.features) && car.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          {/* Car description */}
          <div className="mt-6">
            <h4 className="font-semibold mb-1">Description:</h4>
            <p className="text-gray-700">{car.description}</p>
          </div>

          {/* Booking button or login prompt */}
          {user ? (
            <button
              onClick={() => handleBooking(car)}
              className="btn btn-primary mt-6"
              disabled={alreadyBooked}
            >
              {alreadyBooked ? 'Already Booked' : 'Book Now'}
            </button>
          ) : (
            <p className="mt-6 text-red-600 font-semibold">
              Please <a href='/login' className="link link-primary">Login</a> to book this car.
            </p>
          )}

        </motion.div>
      </div>
    </motion.div>
  );
};

export default CarDetails;
