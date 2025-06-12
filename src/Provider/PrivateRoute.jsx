import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "./AuthProvider";
import LoadingSpinner from "../Utils/LoadingSpinner";

const PrivateRoute = ({ children }) => {
  // Get user and loading state from AuthContext
  const { user, loading } = useContext(AuthContext);

  // Get current location to redirect back after login
  const location = useLocation();

  // While checking auth status, show a loading spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  // If user is logged in, allow access to protected route
  if (user) {
    return children;
  }

  // If not logged in, redirect to login page
  // Pass current location in state to redirect back after login
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
