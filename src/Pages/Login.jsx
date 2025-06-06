import { motion } from 'framer-motion';
import { FaGoogle } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router';
import useScrollToTop from '../Utils/UseScrollToTop';
import { useContext, useState } from 'react';
import { AuthContext, googleProvider } from '../Provider/AuthProvider';
import Swal from 'sweetalert2';
import { auth } from '../Firebase/firebase__config__';
import { toast } from 'react-toastify';
import { signInWithPopup } from 'firebase/auth';

const Login = () => {
    useScrollToTop();
    const { signIn } = useContext(AuthContext);
    const [error, setError] = useState('')
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/'

    const handleLogin = e => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        signIn(email, password)
            .then(() => {
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
                navigate(from, { replace: true });
            })
            .catch((error) => {
                if (error) {
                    setError(error)
                    toast.error("Password Wrong")
                }
            });
    };


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
            navigate('/');
        }
    } catch (error) {
        console.error("Google Login Error:", error.message);
        toast.error(`Can't sign in: ${error.message}`);
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

                <form
                    onSubmit={handleLogin}
                    className="space-y-4">
                    <div>
                        <label className="label" htmlFor="email">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="input input-bordered w-full"
                        />
                    </div>

                    <div>
                        <label className="label" htmlFor="password">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="input input-bordered w-full"
                        />
                    </div>

                    {error && (
                        <div className="text-error text-sm font-medium">{error}</div>
                    )}

                    <button type="submit" className="btn btn-primary w-full">
                        Login
                    </button>
                </form>

                <div className="divider my-4">OR</div>

                <button
                    onClick={handleGoogleLogin}
                    className="btn btn-outline w-full flex items-center justify-center gap-2"
                >
                    <FaGoogle />
                    Continue with Google
                </button>

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