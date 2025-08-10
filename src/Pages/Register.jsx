import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import useScrollToTop from "../Utils/UseScrollToTop";
import { useContext, useState } from "react";
import { AuthContext, googleProvider } from "../Provider/AuthProvider";
import { FcGoogle } from "react-icons/fc";
import Swal from "sweetalert2";
import { signInWithPopup, updateProfile } from "firebase/auth";
import { auth } from "../Firebase/firebase__config__";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaCar } from "react-icons/fa";
import axios from "axios";

const Register = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { createUser } = useContext(AuthContext);

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

  const saveUserToDB = async (name, email) => {
    try {
      await axios.post(
        "https://server-car-rental.vercel.app/users",
        { name, email },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Failed to save user:", err);
    }
  };

const handleRegister = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  const form = e.target;
  const name = form.name.value;
  const email = form.email.value;
  const password = form.password.value;
  const photoURL = form.photoURL.value;

  setError("");

  if (password.length < 6) {
    setError("Password must be at least 6 characters");
    setIsLoading(false);
    return;
  }

  try {
    // 1. Create user
    const userCredential = await createUser(email, password);
    
    // 2. Update profile
    await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL || undefined
    });
    
    // 3. Force refresh of user data
    await auth.currentUser.reload();
    
    // 4. Now save to DB with updated info
    await saveUserToDB(name, email);

    showSuccessToast("Registration Successful!");
    form.reset();
    navigate("/");
  } catch (error) {
    handleRegisterError(error);
  } finally {
    setIsLoading(false);
  }
};

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await saveUserToDB(user.displayName || "Unnamed User", user.email);

      showSuccessToast("Google Registration Successful!");
      navigate("/");
    } catch (error) {
      showErrorToast(`Google Sign In Failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccessToast = (message) => {
    Swal.fire({
      title: message,
      icon: "success",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "#f0f9ff",
      color: "#0f172a"
    });
  };

  const showErrorToast = (message) => {
    Swal.fire({
      title: message,
      icon: "error",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "#f0f9ff",
      color: "#0f172a"
    });
  };

  const handleRegisterError = (error) => {
    const errorCode = error?.code || "";
    const errorMessageMap = {
      "auth/email-already-in-use": "Email already in use. Please login instead.",
      "auth/weak-password": "Password should be at least 6 characters.",
      "auth/invalid-email": "Please enter a valid email address."
    };
    setError(errorMessageMap[errorCode] || "Registration failed. Please try again.");
  };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="w-11/12 mx-auto p-7">
                <div className="flex flex-col lg:flex-row rounded-xl overflow-hidden shadow-2xl">
                    {/* Left Side - Image (Hidden on mobile) */}
                    <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-primary to-secondary relative">
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="text-center p-8 text-white">
                                <FaCar className="text-6xl mx-auto mb-6" />
                                <h2 className="text-4xl font-bold mb-4">Join Rentizo</h2>
                                <p className="text-xl mb-6">Your premium car rental solution</p>
                                <p className="text-gray-300">
                                    Register to access thousands of vehicles and exclusive deals for our members.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Registration Form */}
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
                                        Create Account
                                    </span>
                                </h2>
                                <p className="text-gray-400">Join Rentizo to access premium features</p>
                            </motion.div>

                            {/* Registration Form */}
                            <motion.form variants={itemVariants} onSubmit={handleRegister} className="space-y-5">
                                <motion.div variants={itemVariants}>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">Full Name</label>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                                        onChange={() => setError('')}
                                        placeholder="John Doe"
                                    />
                                </motion.div>

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

                                <motion.div variants={itemVariants}>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">Photo URL (Optional)</label>
                                    <input
                                        name="photoURL"
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                                        placeholder="https://example.com/photo.jpg"
                                    />
                                </motion.div>

                                {error && (
                                    <motion.div
                                        variants={itemVariants}
                                        className="text-red-400 text-sm font-medium px-4 py-2 bg-red-900/20 rounded-lg"
                                    >
                                        {error}
                                    </motion.div>
                                )}

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
                                            Registering...
                                        </>
                                    ) : (
                                        "Register"
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
                                onClick={handleGoogleSignIn}
                                className="w-full py-3 px-6 bg-gray-700 rounded-lg font-medium flex items-center justify-center gap-3 hover:bg-gray-600 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading}
                            >
                                <FcGoogle className="text-xl" />
                                Continue with Google
                            </motion.button>

                            <motion.div variants={itemVariants} className="mt-6 text-center text-sm text-gray-400">
                                Already have an account?{' '}
                                <Link to="/login" className="text-primary font-semibold hover:underline">
                                    Login
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;