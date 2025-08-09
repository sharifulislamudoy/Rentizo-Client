import {
  RouterProvider
} from "react-router";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './Routes/Router.jsx';
import AuthProvider from "./Provider/AuthProvider.jsx";
import { ReTitleProvider } from "re-title";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ReTitleProvider>
        <RouterProvider router={router} />
      </ReTitleProvider>
    </AuthProvider>
  </StrictMode>,
)
