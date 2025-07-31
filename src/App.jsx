import { Toaster } from "react-hot-toast";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import Assignment from "./ui/admin/pages/Assignment/Assignment";
import Dashboard from "./ui/admin/pages/Dashboard/Dashboard";
import Inventory from "./ui/admin/pages/Inventory/Inventory";
import Users from "./ui/admin/pages/Users/Users";
import AdminTemplate from "./ui/admin/templates/AdminTemplate";
import ProtectedRoute from "./ui/ProtectedRoute";
import Hero from "./ui/user/components/hero/Hero";
import ForgotPassword from "./ui/user/pages/ForgotPassword";
import Login from "./ui/user/pages/Login";
import Register from "./ui/user/pages/Register";
import LandingTemplate from "./ui/user/templates/Landing.Template";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },

  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminTemplate />
      </ProtectedRoute>
    ),

    children: [
      { index: true, element: <Dashboard /> },
      { path: "users", element: <Users /> },
      { path: "inventory", element: <Inventory /> },
      { path: "assignment", element: <Assignment /> },
    ],
  },
  {
    path: "/user",
    element: (
      <ProtectedRoute>
        <LandingTemplate />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <Hero /> }],
  },
]);

const App = () => (
  <>
    <RouterProvider router={router} />
    <Toaster position="bottom-right" reverseOrder={false} />
  </>
);

export default App;
