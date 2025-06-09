import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "./AuthProvider";
import LoadingSpinner from "../Utils/LoadingSpinner";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
