import {
  createBrowserRouter
} from "react-router";
import Main from "../Layouts/Main";
import Home from "../Pages/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Main,
    children: [
        {
            index: true,
            Component: Home,
        }
    ]
  },
]);