import { createBrowserRouter } from "react-router";
import Main from "../Layouts/Main";
import Home from "../Pages/Home";
import NotFoundPage from "../Pages/NotFoundPage";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import AddCar from "../Pages/AddCars";
import MyCars from "../Pages/MyCars";
import AvailableCars from "../Pages/AvailableCars";
import CarDetails from "../Pages/CarDetails";
import MyBookings from "../Pages/MyBookings";
import HolidayDeal from "../Components/HolidayDeal";
import PrivateRoute from "../Provider/PrivateRoute";

// Define the app routes using React Router's createBrowserRouter
export const router = createBrowserRouter([
  {
    path: "/", // Main layout path
    Component: Main, // Layout component wrapping all child routes
    errorElement: <NotFoundPage />, // Shown when route is not found
    children: [
      {
        index: true, // Default route for "/"
        Component: Home, // Home page component
      },
      {
        path: "/login", // Login page route
        Component: Login,
      },
      {
        path: "/register", // Register page route
        Component: Register,
      },
      {
        path: "/add-car", // Protected route to add a car
        element: (
          <PrivateRoute>
            <AddCar />
          </PrivateRoute>
        ),
      },
      {
        path: "/my-cars", // Protected route to show user's cars
        element: (
          <PrivateRoute>
            <MyCars />
          </PrivateRoute>
        ),
      },
      {
        path: "/available-cars", // Public route to show available cars
        Component: AvailableCars,
      },
      {
        path: "/car-details/:id", // Dynamic route for car details by id
        element: <CarDetails />,
      },
      {
        path: "/my-bookings", // Protected route to show user's bookings
        element: (
          <PrivateRoute>
            <MyBookings />
          </PrivateRoute>
        ),
      },
      {
        path: "/holiday-deal", // Public route to show holiday deals
        Component: HolidayDeal,
      },
    ],
  },
]);
