import {
  createBrowserRouter
} from "react-router";
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

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Main,
    errorElement:<NotFoundPage></NotFoundPage>,
    children: [
        {
            index: true,
            Component: Home,
        },
        {
          path: '/login',
          Component: Login,
        },
        {
          path: '/register',
          Component: Register
        },
        {
          path: '/add-car',
          element: <AddCar />
        },
        {
          path: '/my-cars',
          element: <MyCars />
        },
        {
          path: '/available-cars',
          Component: AvailableCars,
        },
        {
          path: '/car-details/:id',
          element: <CarDetails />
        },
        {
          path: '/my-bookings',
          element: <MyBookings />
        },
        {
          path: '/holiday-deal',
          Component: HolidayDeal,
        }
    ]
  },
]);