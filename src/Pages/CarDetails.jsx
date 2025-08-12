import { Link, useNavigate, useParams } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { FaCar, FaGasPump, FaMapMarkerAlt, FaStar, FaCheckCircle, FaInfoCircle, FaCogs, FaComments, FaHeadset, FaHeart, FaRegHeart } from 'react-icons/fa';
import { AuthContext } from '../Provider/AuthProvider';
import { ReTitle } from 're-title';

const CarDetails = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userBookings, setUserBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [pickupLocations, setPickupLocations] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const alreadyBooked = userBookings.some(booking => booking.carId === id);

  // Check if car is wishlisted on component mount
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setIsWishlisted(wishlist.includes(id));
  }, [id]);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:3000/bookings?email=${user.email}`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => setUserBookings(data));
    }

    // Fetch pickup locations
    fetch('/pickup-locations.json')
      .then(res => res.json())
      .then(data => setPickupLocations(data));
  }, [user]);

  useEffect(() => {
    fetch(`http://localhost:3000/cars/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCar(data);
        setLoading(false);
      });
  }, [id]);

  const toggleWishlist = () => {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (isWishlisted) {
      wishlist = wishlist.filter(carId => carId !== id);
      Swal.fire({
        title: 'Removed!',
        text: 'Car removed from your wishlist',
        icon: 'success',
        confirmButtonColor: '#3B82F6',
        background: '#1F2937',
        color: '#FFFFFF',
        timer: 1500
      });
    } else {
      wishlist.push(id);
      Swal.fire({
        title: 'Added!',
        text: 'Car added to your wishlist',
        icon: 'success',
        confirmButtonColor: '#3B82F6',
        background: '#1F2937',
        color: '#FFFFFF',
        timer: 1500
      });
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    setIsWishlisted(!isWishlisted);
  };

  const handleBooking = async (car) => {
    const result = await Swal.fire({
      title: 'Confirm Booking',
      html: `
      <div class="text-left">
        <p class="mb-2"><strong style="color:#60A5FA;">Car:</strong> ${car.carModel}</p>
        <p class="mb-2"><strong style="color:#60A5FA;">Price/Day:</strong> $${car.pricePerDay}</p>
        <p class="mb-2"><strong style="color:#60A5FA;">Location:</strong> ${car.location}</p>

        <div class="flex flex-wrap gap-4">
          <div class="flex flex-col w-full sm:w-1/2 gap-1">
            <label for="startDate" class="mb-2">
              <strong style="color:#60A5FA;">Start Date:</strong>
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          <div class="flex flex-col w-full sm:w-1/2">
            <label for="endDate" class="mb-2">
              <strong style="color:#60A5FA;">End Date:</strong>
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>
        </div>

        <div class="mt-4">
          <label for="pickupLocation" class="mb-2 block">
            <strong style="color:#60A5FA;">Pickup Location:</strong>
          </label>
          <select
            id="pickupLocation"
            name="pickupLocation"
            class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            required
          >
            <option class="border bg-gray-950" value="">Select a pickup location</option>
            ${pickupLocations.map(location => `
              <option class="border bg-gray-950" value="${location._id}">${location.name} - ${location.address}</option>
            `).join('')}
          </select>
        </div>
      </div>
    `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Confirm Booking',
      confirmButtonColor: '#3B82F6',
      background: '#1F2937',
      color: '#FFFFFF',
      preConfirm: () => {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const pickupLocation = document.getElementById('pickupLocation').value;

        if (!startDate || !endDate || !pickupLocation) {
          Swal.showValidationMessage('Please fill all required fields');
          return false;
        }

        if (new Date(startDate) > new Date(endDate)) {
          Swal.showValidationMessage('End date must be after start date');
          return false;
        }

        return { startDate, endDate, pickupLocation };
      }
    });

    if (result.isConfirmed) {
      const selectedLocation = pickupLocations.find(loc => loc._id === result.value.pickupLocation);
      
      const bookingInfo = {
        carId: car._id,
        carModel: car.carModel,
        carImage: car.image,
        pricePerDay: car.pricePerDay,
        location: car.location,
        userEmail: user?.email,
        userName: user?.displayName,
        bookingDate: new Date().toISOString(),
        startDate: result.value.startDate,
        endDate: result.value.endDate,
        pickupLocation: {
          id: selectedLocation._id,
          name: selectedLocation.name,
          address: selectedLocation.address
        },
        status: 'Pending'
      };

      try {
        const response = await fetch(`http://localhost:3000/bookings?email=${user?.email}`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingInfo),
        });

        if (!response.ok) throw new Error('Failed to save booking');

        await fetch(`http://localhost:3000/bookings/${car._id}/increment`, { method: 'PATCH' });

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
      <ReTitle title={`Rentizo | ${car.carModel}`} />
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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Car Image */}
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-2xl overflow-hidden border border-gray-700 shadow-lg">
              <img
                src={car.image}
                alt={car.carModel}
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-4 right-4">
                <button 
                  onClick={toggleWishlist}
                  className="p-3 bg-gray-900/80 rounded-full backdrop-blur-sm hover:bg-gray-800 transition-colors"
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {isWishlisted ? (
                    <FaHeart className="text-red-500 text-xl" />
                  ) : (
                    <FaRegHeart className="text-white text-xl hover:text-red-500 transition-colors" />
                  )}
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="text-2xl font-bold text-primary">${car.pricePerDay}<span className="text-gray-400 text-sm font-normal"> / day</span></div>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaCogs className="text-primary" />
                <span>Quick Specifications</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Type</p>
                  <p className="font-medium">{car.type || 'Sedan'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Transmission</p>
                  <p className="font-medium">{car.transmission || 'Automatic'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Fuel</p>
                  <p className="font-medium">{car.fuelType || 'Gasoline'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Seats</p>
                  <p className="font-medium">{car.seats || '5'}</p>
                </div>
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
            <div className="bg-gray-950 rounded-2xl overflow-hidden border border-gray-700 shadow-lg">
              {/* Tabs */}
              <div className="flex border-b border-gray-700 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`flex-shrink-0 py-4 px-4 text-center font-medium flex items-center justify-center gap-2 ${activeTab === 'description' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                >
                  <FaInfoCircle />
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`flex-shrink-0 py-4 px-4 text-center font-medium flex items-center justify-center gap-2 ${activeTab === 'specs' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                >
                  <FaCogs />
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-shrink-0 py-4 px-4 text-center font-medium flex items-center justify-center gap-2 ${activeTab === 'reviews' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                >
                  <FaComments />
                  Reviews
                </button>
                <button
                  onClick={() => setActiveTab('support')}
                  className={`flex-shrink-0 py-4 px-4 text-center font-medium flex items-center justify-center gap-2 ${activeTab === 'support' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                >
                  <FaHeadset />
                  Support
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Description Tab */}
                {activeTab === 'description' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold mb-4">About This Vehicle</h3>
                    <p className="text-gray-300 mb-6">{car.description}</p>

                    {Array.isArray(car.features) && car.features.length > 0 && (
                      <>
                        <h4 className="text-lg font-semibold mb-3 text-gray-300">Key Features</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                          {car.features.map((feature, index) => (
                            <div key={index} className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                              <span className="text-gray-300">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </motion.div>
                )}

                {/* Specifications Tab */}
                {activeTab === 'specs' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold mb-6">Technical Specifications</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-300 mb-2">Performance</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-400 text-sm">Engine</p>
                            <p className="font-medium">{car.engine || '2.0L Turbo'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Horsepower</p>
                            <p className="font-medium">{car.horsepower || '250 HP'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">0-60 mph</p>
                            <p className="font-medium">{car.acceleration || '6.2s'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Top Speed</p>
                            <p className="font-medium">{car.topSpeed || '140 mph'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-300 mb-2">Dimensions</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-400 text-sm">Length</p>
                            <p className="font-medium">{car.length || '186 in'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Width</p>
                            <p className="font-medium">{car.width || '72 in'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Height</p>
                            <p className="font-medium">{car.height || '58 in'}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Weight</p>
                            <p className="font-medium">{car.weight || '3,500 lbs'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold mb-6">Customer Reviews</h3>
                    <div className="space-y-6">
                      {car.reviews && car.reviews.length > 0 ? (
                        car.reviews.map((review, index) => (
                          <div key={index} className="bg-gray-800 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <div className="flex items-center mr-4">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar key={i} className={`${i < review.rating ? 'text-yellow-400' : 'text-gray-500'} mr-1`} />
                                ))}
                              </div>
                              <span className="font-medium">{review.user}</span>
                              <span className="text-gray-400 text-sm ml-auto">{review.date}</span>
                            </div>
                            <p className="text-gray-300">{review.comment}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-400">No reviews yet. Be the first to review!</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Support Tab */}
                {activeTab === 'support' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold mb-6">Support & Contact</h3>
                    <div className="space-y-6">
                      <div className="bg-gray-800 p-6 rounded-lg">
                        <h4 className="font-semibold text-lg mb-4">Owner Information</h4>
                        <div className="space-y-3">
                          <p className="flex items-center">
                            <span className="text-gray-400 w-24">Name:</span>
                            <span className="font-medium">{car.addedBy?.name || "Not specified"}</span>
                          </p>
                          <p className="flex items-center">
                            <span className="text-gray-400 w-24">Email:</span>
                            <span className="font-medium">{car.addedBy?.email || "Not specified"}</span>
                          </p>
                          <p className="flex items-center">
                            <span className="text-gray-400 w-24">Phone:</span>
                            <span className="font-medium">{car.addedBy?.phone || "Not provided"}</span>
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-800 p-6 rounded-lg">
                        <h4 className="font-semibold text-lg mb-4">Need Help?</h4>
                        <p className="text-gray-300 mb-4">Our customer support team is available 24/7 to assist you with any questions.</p>
                        <Link to={'/contact-us'} className="bg-primary hover:bg-primary/90 text-white py-2 px-6 rounded-lg font-medium transition-colors">
                          Contact Support
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Booking Button */}
            <div className="mt-8">
              {user ? (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBooking(car)}
                  disabled={alreadyBooked || car.availability !== "Available"}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all text-lg ${alreadyBooked
                    ? "bg-gray-800 cursor-not-allowed"
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
                <div className="text-center bg-gray-800 p-6 rounded-xl border border-gray-700">
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
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CarDetails;