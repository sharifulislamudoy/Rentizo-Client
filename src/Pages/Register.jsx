import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router';
import useScrollToTop from '../Utils/UseScrollToTop';
import { useContext, useState } from 'react';
import { AuthContext, googleProvider } from '../Provider/AuthProvider';
import { FcGoogle } from 'react-icons/fc';
import Swal from 'sweetalert2';
import { signInWithPopup, updateProfile } from 'firebase/auth';
import { auth } from '../Firebase/firebase__config__';

const Register = () => {
    useScrollToTop(); // Scroll to top when this component mounts
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const { createUser, setUser, updateUser } = useContext(AuthContext);

    // Handles user registration with email and password
    const handleRegister = e => {
        e.preventDefault();

        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        const photoURL = form.photoURL.value;

        setError(''); // Clear previous errors

        // Simple password validation
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        // Create new user using Firebase authentication
        createUser(email, password)
            .then(result => {
                // Update user profile with name and photo URL after registration
                updateProfile(auth.currentUser, {
                    displayName: name,
                    photoURL: photoURL || undefined,
                }).then(() => {
                    // Show success notification using SweetAlert2
                    Swal.fire({
                        title: 'Registration Successful!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        background: "#f0fdf4",
                        color: "#14532d",
                    });
                    navigate('/'); // Redirect to homepage after registration
                });
            })
            .catch(error => {
                console.error(error);
                setError(error.message); // Show error message on failure
            });
    };

    // Handles user registration/login using Google sign-in popup
    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            if (result.user) {
                Swal.fire({
                    title: "Registration Successful!",
                    icon: "success",
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    background: "#f0f9ff",
                    color: "#0f172a",
                });
                navigate('/'); // Redirect to homepage on success
            }
        } catch (error) {
            console.log(error);
            setError(error.message); // Show error message on failure
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100 px-4">
            {/* Animated container for the registration form */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 rounded-xl shadow-xl bg-base-200"
            >
                <h2 className="text-3xl font-bold text-center mb-6 text-primary">Register for Rentizo</h2>

                {/* Registration form */}
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="label">Name</label>
                        <input type="text" name="name" required className="input input-bordered w-full" />
                    </div>

                    <div>
                        <label className="label">Email</label>
                        <input type="email" name="email" required className="input input-bordered w-full" />
                    </div>

                    <div>
                        <label className="label">Password</label>
                        <input type="password" name="password" required className="input input-bordered w-full" />
                    </div>

                    <div>
                        <label className="label">Photo URL</label>
                        <input type="text" name="photoURL" className="input input-bordered w-full" />
                    </div>

                    {/* Display error messages if any */}
                    {error && <div className="text-error text-sm">{error}</div>}

                    <button type="submit" className="btn btn-primary w-full">Register</button>
                </form>

                <div className="divider my-4">OR</div>

                {/* Google sign-in button */}
                <button
                    onClick={handleGoogleSignIn}
                    className="btn btn-outline w-full flex items-center justify-center gap-2"
                >
                    <FcGoogle /> Sign Up with Google
                </button>

                {/* Link to login page for existing users */}
                <p className="mt-4 text-center text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-semibold hover:underline">
                        Login
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
