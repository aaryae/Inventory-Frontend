import { Toaster } from "react-hot-toast";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import Dashboard from "./ui/admin/pages/Dashboard/Dashboard";
import Inventory from "./ui/admin/pages/Inventory/Inventory";
import Users from "./ui/admin/pages/Users/Users";
import AdminTemplate from "./ui/admin/templates/AdminTemplate";
import ProtectedRoute from "./ui/ProtectedRoute";
import Hero from "./ui/user/components/hero/Hero";
import Login from "./ui/user/pages/Login";
import LandingTemplate from "./ui/user/templates/Landing.Template";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
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
      { path: "assignment", element: <Inventory /> },
    ],
  },
  {
    path: "/user",
    element: <LandingTemplate />,
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
