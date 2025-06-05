import {
  createBrowserRouter
} from "react-router";
import Main from "../Layouts/Main";
import Home from "../Pages/Home";
import NotFoundPage from "../Pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Main,
    errorElement:<NotFoundPage></NotFoundPage>,
    children: [
        {
            index: true,
            Component: Home,
        }
    ]
  },
]);