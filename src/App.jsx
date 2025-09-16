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
import ForgotPassword from "./ui/user/pages/ForgotPassword";
import Login from "./ui/user/pages/Login";
import Register from "./ui/user/pages/Register";
import LandingTemplate from "./ui/user/templates/Landing.Template";
import Batch from "./ui/admin/pages/Batch/batch";
import Master from "./ui/admin/pages/Master/masters";
import Barcode from "./ui/admin/pages/Barcode/barcode";

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
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminTemplate />
      </ProtectedRoute>
    ),

    children: [
      { index: true, element: <Dashboard /> },
      { path: "users", element: <Users /> },
      { path: "inventory", element: <Inventory /> },
      { path: "assignment", element: <Assignment /> },
      { path: "master", element: <Master /> },
      { path: "batch", element:<Batch/>},
      { path: "barcode", element:<Barcode/>},


    ],
  },
  
{
  path: "/user",
  element: (
    <ProtectedRoute allowedRoles={['user']}> 
      <LandingTemplate />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <Dashboard /> },
    { path: "users", element: <Users /> },
    { path: "inventory", element: <Inventory /> },
    { path: "assignment", element: <Assignment /> },
    { path: "master", element: <Master /> },
    { path: "batch", element:<Batch/>},
    { path: "barcode", element:<Barcode/>},
 
  ],
}



]);

const App = () => (
  <>
    <RouterProvider router={router} />
    <Toaster position="bottom-right" reverseOrder={false} />
  </>
);

export default App;
