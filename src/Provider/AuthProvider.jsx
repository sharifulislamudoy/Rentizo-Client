import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../Firebase/firebase__config__";
import axios from "axios";

export const AuthContext = createContext();
export const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Save user to DB
  const saveUserToDB = async (name, email) => {
    try {
      await axios.post(
        "http://localhost:3000/users",
        { name, email }, // role defaults to 'user' in backend
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  const updateUser = (updatedData) => {
    return updateProfile(auth.currentUser, updatedData);
  };

  const resetPassword = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser?.email) {
        try {
          // Save user to DB (name from displayName)
          await saveUserToDB(currentUser.displayName || "Unnamed User", currentUser.email);

          // Request JWT
          await axios.post(
            "http://localhost:3000/jwt",
            { email: currentUser.email },
            { withCredentials: true }
          );
        } catch (error) {
          console.error("Auth state change error:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

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
    <AuthContext.Provider value={authInfo}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
