import {
  createBrowserRouter
} from "react-router";
import Main from "../Layouts/Main";
import Home from "../Pages/Home";
import NotFoundPage from "../Pages/NotFoundPage";
import Login from "../Pages/Login";
import Register from "../Pages/Register";

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
        }
    ]
  },
]);