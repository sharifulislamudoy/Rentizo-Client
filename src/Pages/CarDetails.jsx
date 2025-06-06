import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://your-api-url.com/cars/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCar(data);
        setLoading(false);
      });
  }, [id]);

  const handleBooking = () => {
    Swal.fire({
      title: 'Confirm Booking',
      html: `
        <p><strong>Car:</strong> ${car.carModel}</p>
        <p><strong>Price/Day:</strong> $${car.pricePerDay}</p>
        <p><strong>Location:</strong> ${car.location}</p>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if (result.isConfirmed) {
        // Book the car (post to DB or redirect)
        Swal.fire('Booked!', 'Your booking has been confirmed.', 'success');
      }
    });
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-5xl mx-auto"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <img
          src={car.image}
          alt={car.carModel}
          className="w-full h-72 object-cover rounded shadow"
        />

        <div>
          <h2 className="text-3xl font-bold mb-4">{car.carModel}</h2>
          <p className="text-lg mb-2"><strong>Price Per Day:</strong> ${car.pricePerDay}</p>
          <p className="text-lg mb-2"><strong>Availability:</strong> {car.availability}</p>
          <p className="text-lg mb-2"><strong>Location:</strong> {car.location}</p>
          <p className="text-lg mb-2"><strong>Registration Number:</strong> {car.registrationNumber}</p>

          <div className="mt-4">
            <h4 className="font-semibold mb-1">Features:</h4>
            <ul className="list-disc list-inside text-gray-700">
              {car.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold mb-1">Description:</h4>
            <p className="text-gray-700">{car.description}</p>
          </div>

          <button
            onClick={handleBooking}
            className="btn btn-primary mt-6"
          >
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CarDetails;
