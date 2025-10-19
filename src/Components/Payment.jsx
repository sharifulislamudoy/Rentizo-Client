import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { FaCar, FaCalendar, FaMapMarkerAlt, FaCreditCard, FaLock, FaCheckCircle } from 'react-icons/fa';
import { AuthContext } from '../Provider/AuthProvider';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const location = useLocation();
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');

  const { bookingData, car } = location.state || {};

  useEffect(() => {
    if (!bookingData || !car) {
      navigate('/available-cars');
      return;
    }

    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('http://localhost:3000/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            amount: calculateTotalAmount(),
            currency: 'usd',
            bookingId: bookingData._id,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to initialize payment. Please try again.',
          icon: 'error',
          confirmButtonColor: '#3B82F6',
          background: '#1F2937',
          color: '#FFFFFF'
        });
      }
    };

    createPaymentIntent();
  }, [bookingData, car, navigate]);

  const calculateTotalAmount = () => {
    if (!bookingData || !car) return 0;
    
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const total = days * car.pricePerDay;
    
    // Add 10% tax and $10 service fee
    return Math.round((total + total * 0.1 + 10) * 100);
  };

  const calculateBreakdown = () => {
    if (!bookingData || !car) return {};
    
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const baseAmount = days * car.pricePerDay;
    const tax = baseAmount * 0.1;
    const serviceFee = 10;
    const total = baseAmount + tax + serviceFee;
    
    return {
      days,
      baseAmount,
      tax,
      serviceFee,
      total
    };
  };

  const savePaymentToDB = async (paymentData) => {
    try {
      const response = await fetch('http://localhost:3000/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Failed to save payment data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving payment:', error);
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user?.displayName || 'Customer',
            email: user?.email,
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        setSucceeded(true);
        
        // Save payment data to database
        const paymentData = {
          bookingId: bookingData._id,
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount / 100, // Convert back to dollars
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          userEmail: user?.email,
          userName: user?.displayName,
          carId: car._id,
          carModel: car.carModel,
          bookingDetails: {
            startDate: bookingData.startDate,
            endDate: bookingData.endDate,
            pickupLocation: bookingData.pickupLocation
          }
        };

        await savePaymentToDB(paymentData);

        // Update booking status to confirmed
        const updateResponse = await fetch(`http://localhost:3000/bookings/${bookingData._id}?email=${user.email}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'Confirmed',
            paymentStatus: 'Paid',
            paymentIntentId: paymentIntent.id,
            paidAmount: calculateBreakdown().total,
          }),
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to update booking status');
        }

        await Swal.fire({
          title: 'Payment Successful!',
          text: 'Your booking has been confirmed and payment processed.',
          icon: 'success',
          confirmButtonColor: '#3B82F6',
          background: '#1F2937',
          color: '#FFFFFF'
        });
        
        navigate('/my-bookings');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'An unexpected error occurred');
      setProcessing(false);
    }
  };

  if (!bookingData || !car) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No booking data found</p>
          <Link to="/available-cars" className="bg-primary text-white px-6 py-2 rounded-lg">
            Browse Cars
          </Link>
        </div>
      </div>
    );
  }

  const breakdown = calculateBreakdown();

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#FFFFFF',
        '::placeholder': {
          color: '#9CA3AF',
        },
        backgroundColor: '#374151',
      },
      invalid: {
        color: '#EF4444',
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Booking Summary */}
      <motion.div
        className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaCheckCircle className="text-green-400" />
          Booking Summary
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Car Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-300">Car Details</h3>
            <div className="flex items-start gap-4">
              <img
                src={car.image}
                alt={car.carModel}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <h4 className="font-bold text-xl text-white">{car.carModel}</h4>
                <p className="text-gray-400">{car.type}</p>
                <p className="text-primary font-semibold text-lg">${car.pricePerDay}/day</p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-300">Booking Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FaCalendar className="text-primary" />
                <span className="text-gray-300">From:</span>
                <span className="text-white font-medium">
                  {new Date(bookingData.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendar className="text-primary" />
                <span className="text-gray-300">To:</span>
                <span className="text-white font-medium">
                  {new Date(bookingData.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-primary" />
                <span className="text-gray-300">Pickup:</span>
                <span className="text-white font-medium">
                  {bookingData.pickupLocation?.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-300">Duration:</span>
                <span className="text-white font-medium">
                  {breakdown.days} days
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Payment Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <motion.div
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FaCreditCard className="text-primary" />
            Payment Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-3 font-medium">
                Card Information
              </label>
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <CardElement options={cardElementOptions} />
              </div>
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {succeeded && (
              <div className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded-lg">
                Payment successful! Redirecting...
              </div>
            )}

            <button
              type="submit"
              disabled={!stripe || !clientSecret || processing || succeeded}
              className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all text-lg flex items-center justify-center gap-2 ${
                processing || !stripe || !clientSecret || succeeded
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30'
              }`}
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FaLock />
                  Pay ${breakdown.total}
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
              <FaLock className="text-green-400" />
              Your payment is secure and encrypted
            </div>
          </form>
        </motion.div>

        {/* Price Breakdown */}
        <motion.div
          className="bg-gray-800 rounded-xl p-6 border border-gray-700 h-fit"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold mb-6 text-gray-300">Price Breakdown</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Base Price ({breakdown.days} days)</span>
              <span className="text-white">${breakdown.baseAmount}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Tax (10%)</span>
              <span className="text-white">${breakdown.tax.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Service Fee</span>
              <span className="text-white">${breakdown.serviceFee}</span>
            </div>
            
            <div className="border-t border-gray-600 pt-4 mt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-white">Total Amount</span>
                <span className="text-primary">${breakdown.total}</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm">Free cancellation up to 24 hours before pickup</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm">24/7 roadside assistance included</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm">Comprehensive insurance coverage</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect if no booking data
  useEffect(() => {
    if (!location.state?.bookingData || !location.state?.car) {
      navigate('/available-cars');
    }
  }, [location, navigate]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black text-white min-h-screen">
      <div className="w-11/12 mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Complete Your Booking
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Secure payment with Stripe - Your information is protected
          </p>
        </motion.div>

        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </section>
  );
};

export default Payment;