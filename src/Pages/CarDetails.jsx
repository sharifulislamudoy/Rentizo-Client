import { useNavigate, useParams } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import useScrollToTop from '../Utils/UseScrollToTop';
import { AuthContext } from '../Provider/AuthProvider';

const CarDetails = () => {
  useScrollToTop();
  const { user } = useContext(AuthContext)
  const navigate = useNavigate();
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userBookings, setUserBookings] = useState([]);
  const alreadyBooked = userBookings.some(booking => booking.carId === id);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:3000/bookings?email=${user.email}`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => setUserBookings(data));
    }
  }, [user]);


  useEffect(() => {
    fetch(`http://localhost:3000/cars/${id}`)
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
      <p><strong>Car:</strong> ${car.carModel}</p>
      <p><strong>Price/Day:</strong> $${car.pricePerDay}</p>
      <p><strong>Location:</strong> ${car.location}</p>
    `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
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
        const response = await fetch('http://localhost:3000/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingInfo),
        });

        if (!response.ok) {
          throw new Error('Failed to save booking');
        }

        await fetch(`http://localhost:3000/bookings/${car._id}/increment`, {
          method: 'PATCH',
        });

        await Swal.fire('Booked!', 'Your booking has been confirmed.', 'success');
        navigate('/my-bookings');
      } catch (error) {
        console.error('Booking failed:', error);
        Swal.fire('Error!', 'Something went wrong while booking.', 'error');
      }
    }
  };





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
        {/* Car image animation from Y-axis */}
        <motion.img
          src={car.image}
          alt={car.carModel}
          className="w-full h-72 object-cover rounded shadow"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />

        {/* Car details animation from X-axis */}
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

          <div className="mt-4">
            <h4 className="font-semibold mb-1">Features:</h4>
            <ul className="list-disc list-inside text-gray-700">
              {Array.isArray(car.features) && car.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold mb-1">Description:</h4>
            <p className="text-gray-700">{car.description}</p>
          </div>

          {user ? (
            <button
              onClick={() => handleBooking(car)}
              className="btn btn-primary mt-6"
              disabled={alreadyBooked}
            >
              {alreadyBooked ? 'Already Booked' : 'Book Now'}
            </button>
          ) : (
            <p className="mt-6 text-red-600 font-semibold">Please <a href='/login' className="link link-primary">Login</a> to book this car.</p>
          )}

        </motion.div>
      </div>
    </motion.div>

  );
};

export default CarDetails;
