import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminTemplate from "./ui/admin/templates/AdminTemplate";
import { Dashboard, Users, Inventory } from "./ui/admin/pages";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminTemplate />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="inventory" element={<Inventory />} />
        </Route>
        {/* Add other routes here if needed */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
