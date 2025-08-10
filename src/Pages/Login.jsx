import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router';
import { useContext, useState } from 'react';
import { AuthContext, googleProvider } from '../Provider/AuthProvider';
import Swal from 'sweetalert2';
import { auth } from '../Firebase/firebase__config__';
import { signInWithPopup } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FaCar } from 'react-icons/fa';
import { ReTitle } from 're-title';

const Login = () => {
    const { signIn, resetPassword } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        try {
            await signIn(email, password);
            showSuccessToast("Login Successful!");
            form.reset();
            navigate(from, { replace: true });
        } catch (error) {
            handleLoginError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await signInWithPopup(auth, googleProvider);
            showSuccessToast("Google Login Successful!");
            navigate('/');
        } catch (error) {
            showErrorToast(`Google Sign In Failed: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgetPassword = async () => {
        const { value: email } = await Swal.fire({
            title: 'Reset Password',
            input: 'email',
            inputLabel: 'Enter your email address',
            inputPlaceholder: 'example@email.com',
            confirmButtonText: 'Send Reset Link',
            showCancelButton: true,
            inputValidator: (value) => !value && 'Please enter your email'
        });

        if (email) {
            try {
                await resetPassword(email);
                showSuccessToast('Reset link sent to your email!');
            } catch (error) {
                showErrorToast(error.message);
            }
        }
    };

    const showSuccessToast = (message) => {
        Swal.fire({
            title: message,
            icon: "success",
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: "#f0f9ff",
            color: "#0f172a",
        });
    };

    const showErrorToast = (message) => {
        Swal.fire({
            title: message,
            icon: "error",
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: "#f0f9ff",
            color: "#0f172a",
        });
    };

    const handleLoginError = (error) => {
        const errorCode = error?.code || '';
        const errorMessageMap = {
            "auth/user-not-found": "No user found with this email.",
            "auth/wrong-password": "Incorrect password. Please try again.",
            "auth/too-many-requests": "Access temporarily disabled due to many failed login attempts.",
            "auth/invalid-email": "Please enter a valid email address.",
        };
        setError(errorMessageMap[errorCode] || "Login failed. Please try again.");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <ReTitle title='Rentizo | Login'/>
            <div className="w-11/12 mx-auto px-7">
                <div className="flex flex-col lg:flex-row rounded-xl overflow-hidden shadow-2xl">
                    {/* Left Side - Image (Hidden on mobile) */}
                    <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-primary to-secondary relative">
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="text-center p-8 text-white">
                                <FaCar className="text-6xl mx-auto mb-6" />
                                <h2 className="text-4xl font-bold mb-4">Welcome to Rentizo</h2>
                                <p className="text-xl mb-6">Your premium car rental solution</p>
                                <p className="text-gray-300">
                                    Login to access thousands of vehicles and exclusive deals for our members.
                                </p>
                            </div>
                        </div>
                        {/* <img 
                            src="https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80" 
                            alt="Luxury Car" 
                            className="w-full h-full object-cover"
                        /> */}
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="w-full lg:w-1/2 bg-gray-900 p-8 lg:p-12">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Header - Visible on mobile */}
                            <motion.div variants={itemVariants} className="lg:hidden text-center mb-8">
                                <div className="flex justify-center mb-4">
                                    <div className="p-3 rounded-full bg-gradient-to-br from-primary to-secondary">
                                        <FaCar className="text-2xl text-white" />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-bold mb-2">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                        Welcome Back
                                    </span>
                                </h2>
                                <p className="text-gray-400">Login to access your Rentizo account</p>
                            </motion.div>

                            {/* Login Form */}
                            <motion.form variants={itemVariants} onSubmit={handleLogin} className="space-y-5">
                                <motion.div variants={itemVariants}>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                                        onChange={() => setError('')}
                                        placeholder="your@email.com"
                                    />
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
                                    <div className="relative">
                                        <input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-white pr-12"
                                            onChange={() => setError('')}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-400 hover:text-white"
                                        >
                                            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                        </button>
                                    </div>
                                </motion.div>

                                {error && (
                                    <motion.div 
                                        variants={itemVariants}
                                        className="text-red-400 text-sm font-medium px-4 py-2 bg-red-900/20 rounded-lg"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <motion.div variants={itemVariants} className="flex justify-end">
                                    <button
                                        onClick={handleForgetPassword}
                                        type="button"
                                        className="text-sm text-primary hover:underline"
                                    >
                                        Forgot Password?
                                    </button>
                                </motion.div>

                                <motion.button
                                    variants={itemVariants}
                                    type="submit"
                                    className="w-full py-3 px-6 bg-gradient-to-r from-primary to-secondary rounded-lg font-medium flex items-center justify-center hover:opacity-90 transition-opacity"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Signing In...
                                        </>
                                    ) : (
                                        "Login"
                                    )}
                                </motion.button>
                            </motion.form>

                            <motion.div variants={itemVariants} className="flex items-center my-6">
                                <div className="flex-1 h-px bg-gray-700"></div>
                                <span className="px-4 text-gray-400 text-sm">OR</span>
                                <div className="flex-1 h-px bg-gray-700"></div>
                            </motion.div>

                            <motion.button
                                variants={itemVariants}
                                onClick={handleGoogleLogin}
                                className="w-full py-3 px-6 bg-gray-700 rounded-lg font-medium flex items-center justify-center gap-3 hover:bg-gray-600 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading}
                            >
                                <FcGoogle className="text-xl" />
                                Continue with Google
                            </motion.button>

                            <motion.div variants={itemVariants} className="mt-6 text-center text-sm text-gray-400">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-primary font-semibold hover:underline">
                                    Register
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;