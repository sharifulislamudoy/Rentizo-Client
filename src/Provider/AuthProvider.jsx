import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  sendPasswordResetEmail, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile 
} from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { auth } from '../Firebase/firebase__config__';
import axios from 'axios';

// Create a context to share auth data across components
export const AuthContext = createContext();

// Google sign-in provider for OAuth
export const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    // Store current logged-in user and loading state
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Register a new user with email and password
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Sign in user with email and password
    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Log out the current user
    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };

    // Update user profile info like display name or photo URL
    const updateUser = (updatedData) => {
        return updateProfile(auth.currentUser, updatedData);
    };

    // Send password reset email to the user
    const resetPassword = (email) => {
        setLoading(true);
        return sendPasswordResetEmail(auth, email);
    };

    // Listen to authentication state changes (login/logout)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            setLoading(false);

            // If user is logged in, request a JWT token from server
            if (currentUser?.email) {
                const userData = { email: currentUser.email };
                axios.post('https://server-car-rental.vercel.app/jwt', userData, {
                    withCredentials: true // send cookies if any
                })
                .then(res => {
                    // Normally you would store the JWT token here (e.g., localStorage)
                })
                .catch(error => {
                    console.log('JWT token request error:', error);
                });
            }
        });

        // Cleanup subscription on component unmount
        return () => {
            unsubscribe();
        };
    }, []);

    // Provide auth methods and user info to all children components
    const authInfo = {
        user,
        setUser,
        loading,
        createUser,
        signIn,
        logOut,
        setLoading,
        updateUser,
        resetPassword
    };

    return (
        // Render children only when loading is false to avoid flickering
        <AuthContext.Provider value={authInfo}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
