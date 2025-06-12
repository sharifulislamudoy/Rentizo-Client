import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router';
import useScrollToTop from '../Utils/UseScrollToTop';
import { useContext, useState } from 'react';
import { AuthContext, googleProvider } from '../Provider/AuthProvider';
import Swal from 'sweetalert2';
import { auth } from '../Firebase/firebase__config__';
import { toast } from 'react-toastify';
import { signInWithPopup } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const Login = () => {
    useScrollToTop(); // Scroll page to top on component mount

    const { signIn, resetPassword } = useContext(AuthContext); // Get auth functions from context
    const [error, setError] = useState(''); // For displaying login errors
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/'; // Redirect after login, default to home

    const [showPassword, setShowPassword] = useState(false); // Toggle password visibility

    // Handle form submission for login
    const handleLogin = e => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        signIn(email, password)
            .then(() => {
                // Show success toast popup on successful login
                Swal.fire({
                    title: "Login Successfully!",
                    icon: "success",
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    background: "#f0f9ff",
                    color: "#0f172a",
                });

                setError(""); // Clear previous error messages
                form.reset(); // Clear the form inputs
                navigate(from, { replace: true }); // Redirect user after login
            })
            .catch((error) => {
                // Handle different error codes and show user-friendly messages
                const errorCode = error?.code || '';
                const errorMessageMap = {
                    "auth/user-not-found": "No user found with this email.",
                    "auth/wrong-password": "Incorrect password. Please try again.",
                    "auth/too-many-requests": "Access temporarily disabled due to many failed login attempts. Try again later.",
                    "auth/invalid-email": "Please enter a valid email address.",
                };
                const errorMessage = errorMessageMap[errorCode] || "Login failed. Please try again later.";
                setError(errorMessage);
            });
    };

    // Handle forgot password flow using SweetAlert input
    const handleForgetPassword = async () => {
        const { value: email } = await Swal.fire({
            title: 'Reset Password',
            input: 'email',
            inputLabel: 'Enter your email address',
            inputPlaceholder: 'example@email.com',
            confirmButtonText: 'Send Reset Link',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'Please enter your email';
                }
            }
        });

        if (email) {
            try {
                await resetPassword(email); // Send password reset email
                Swal.fire({
                    icon: 'success',
                    title: 'Reset link sent!',
                    text: 'Check your email to reset your password.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    background: "#f0f9ff",
                    color: "#0f172a",
                });
            } catch (error) {
                toast.error(error.message); // Show error if reset fails
            }
        }
    };

    // Handle Google sign-in using Firebase popup
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            if (result.user) {
                Swal.fire({
                    title: "Login Successful!",
                    icon: "success",
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    background: "#f0f9ff",
                    color: "#0f172a",
                });
                navigate('/'); // Redirect to home after login
            }
        } catch (error) {
            toast.error(`Can't sign in: ${error.message}`); // Show error message
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 rounded-xl shadow-xl bg-base-200"
            >
                <h2 className="text-3xl font-bold text-center mb-6 text-primary">Login to Rentizo</h2>

                {/* Login form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="label" htmlFor="email">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="input input-bordered w-full"
                            onChange={() => setError('')} // Clear error on input change
                        />
                    </div>

                    <div>
                        <label className="label" htmlFor="password">Password</label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"} // Show/hide password
                                required
                                className="input input-bordered w-full pr-12"
                                onChange={() => setError('')} // Clear error on input change
                            />
                            {/* Toggle password visibility button */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500"
                                title={showPassword ? "Hide Password" : "Show Password"}
                            >
                                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </button>
                        </div>
                    </div>

                    {/* Show error messages */}
                    {error && (
                        <div className="text-error text-sm font-medium">{error}</div>
                    )}

                    {/* Forgot password link */}
                    <p className="text-sm text-right mt-1">
                        <button
                            onClick={handleForgetPassword}
                            type="button"
                            className="text-primary hover:underline"
                        >
                            Forgot Password?
                        </button>
                    </p>

                    {/* Submit login button */}
                    <button type="submit" className="btn btn-primary w-full">
                        Login
                    </button>
                </form>

                <div className="divider my-4">OR</div>

                {/* Google login button */}
                <button
                    onClick={handleGoogleLogin}
                    className="btn btn-outline w-full flex items-center justify-center gap-2"
                >
                    <FcGoogle />
                    Continue with Google
                </button>

                {/* Link to registration page */}
                <p className="mt-4 text-center text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary font-semibold hover:underline">
                        Register
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
