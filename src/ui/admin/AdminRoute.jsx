import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");
  return token && role === "ADMIN" ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
