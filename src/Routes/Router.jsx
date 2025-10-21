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
import AboutUs from "../Pages/AboutUs";
import ContactUs from "../Pages/ContactUs";
import Blog from "../Pages/Blog";
import FAQ from "../Pages/FAQ";
import AdminDashboard from "../Components/DashBoards/AdminDashboard";
import CarOwnerDashboard from "../Components/DashBoards/CarOwnerDashBoard";
import UserDashboard from "../Components/DashBoards/UserDashBoard";
import BookingDetails from "../Pages/BookingDetails";
import Payment from "../Components/Payment";
import CarOwnerRoute from "../Provider/CarOwnerRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Main,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/add-car",
        element: (
          <CarOwnerRoute>
            <AddCar />
          </CarOwnerRoute>
        ),
      },
      {
        path: "/my-cars",
        element: (
          <CarOwnerRoute>
            <MyCars />
          </CarOwnerRoute>
        ),
      },
      {
        path: "/available-cars",
        Component: AvailableCars,
      },
      {
        path: "/car-details/:id",
        element: <CarDetails />,
      },
      {
        path: "/my-bookings",
        element: (
          <PrivateRoute>
            <MyBookings />
          </PrivateRoute>
        ),
      },
      {
        path: '/booking-details/:id',
        Component: BookingDetails
      },
      {
        path: "/holiday-deal",
        Component: HolidayDeal,
      },
      {
        path: '/about-us',
        Component: AboutUs
      },
      {
        path: '/contact-us',
        Component: ContactUs
      },
      {
        path: '/blog',
        Component: Blog
      },
      {
        path: '/faq',
        Component: FAQ
      },
      {
        path: '/payment',
        element: <PrivateRoute>
          <Payment />
        </PrivateRoute>
      }
    ],
  },
  {
    path: '/admin/dashboard',
    Component: AdminDashboard
  },
  {
    path: '/car-owner/dashboard',
    Component: CarOwnerDashboard
  },
  {
    path: '/user/dashboard',
    Component: UserDashboard
  }
]);