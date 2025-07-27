import { Toaster } from "react-hot-toast";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Dashboard from "./ui/admin/pages/Dashboard/Dashboard";
import Inventory from "./ui/admin/pages/Inventory/Inventory";
import Users from "./ui/admin/pages/Users/Users";
import AdminTemplate from "./ui/admin/templates/AdminTemplate";
import ProtectedRoute from "./ui/ProtectedRoute";
import Login from "./ui/user/pages/Login";

const UserDashboard = () => <div className="p-8 text-center">User Dashboard (dummy)</div>;

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
    element: <ProtectedRoute><AdminTemplate /></ProtectedRoute>,
    children: [
      {
        path: "/admin",
        element: <Dashboard />,
        children: [
          { path: "users", element: <Users /> },
          { path: "inventory", element: <Inventory /> },
          { path: "assignment", element: <Inventory /> },
        ],
      },
    ],
  },
  {
    path: "/user",
    element: <ProtectedRoute><UserDashboard /></ProtectedRoute>,
  },
]);

const App = () => (
  <>
    <RouterProvider router={router} />
    <Toaster position="bottom-right" reverseOrder={false} />
  </>
);

export default App;
