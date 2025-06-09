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
    useScrollToTop();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const { createUser, setUser, updateUser } = useContext(AuthContext);

    const handleRegister = e => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        const photoURL = form.photoURL.value;

        setError('');

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        createUser(email, password)
            .then(result => {
                updateProfile(auth.currentUser, {
                    displayName: name,
                    photoURL: photoURL || undefined,
                }).then(() => {
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
                    navigate('/');
                });
            })
            .catch(error => {
                console.error(error);
                setError(error.message);
            });
    };

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
                navigate('/');
            }
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100 px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 rounded-xl shadow-xl bg-base-200"
            >
                <h2 className="text-3xl font-bold text-center mb-6 text-primary">Register for Rentizo</h2>

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

                    {error && <div className="text-error text-sm">{error}</div>}

                    <button type="submit" className="btn btn-primary w-full">Register</button>
                </form>

                <div className="divider my-4">OR</div>

                <button
                    onClick={handleGoogleSignIn}
                    className="btn btn-outline w-full flex items-center justify-center gap-2"
                >
                    <FcGoogle /> Sign Up with Google
                </button>

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
