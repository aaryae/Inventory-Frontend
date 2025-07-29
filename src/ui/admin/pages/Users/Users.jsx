import {
  ChevronLeft,
  ChevronRight,
  Crown,
  Eye,
  Pencil,
  Plus,
  Search,
  Shield,
  Trash2,
  UserCheck,
  Users as UsersIcon,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../../../../services/users/usersService";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    role: "",
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      if (response.success) {
        setUsers(response.data || []);
      } else {
        toast.error(response.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const response = await getUserById(userId);
      if (response.success) {
        setSelectedUser(response.data);
        setShowUserModal(true);
      } else {
        toast.error(response.message || "Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to fetch user details");
    }
  };

  const handleEditUser = (user) => {
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "",
    });
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUser(selectedUser.id, editForm);
      if (response.success) {
        toast.success("User updated successfully");
        setShowEditModal(false);
        fetchUsers();
      } else {
        toast.error(response.message || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const response = await deleteUser(userId);
      if (response.success) {
        toast.success("User deleted successfully");
        fetchUsers(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Calculate statistics
  const totalUsers = users.length;
  const adminUsers = users.filter(
    (user) => user.role?.toLowerCase() === "admin"
  ).length;
  const managerUsers = users.filter(
    (user) => user.role?.toLowerCase() === "manager"
  ).length;
  const regularUsers = users.filter(
    (user) => user.role?.toLowerCase() === "user"
  ).length;

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase() || "U"
    );
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div
      className="p-4 rounded-xl border border-[#21222d] shadow-lg"
      style={{ background: "#171821" }}
    >
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-slate-400">{title}</p>
          <p className="text-xl font-semibold text-slate-100">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="mt-4 text-slate-400">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div
        className="mb-6 p-6 rounded-2xl border border-[#21222d] shadow-lg"
        style={{ background: "#171821" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">
              Users Management
            </h1>
            <p className="text-slate-400 mt-2">
              Manage user accounts and permissions
            </p>
          </div>
          <button className="mt-4 sm:mt-0 flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 px-4 py-2 rounded-lg transition-colors">
            <Plus className="w-5 h-5" />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={UsersIcon}
          title="Total Users"
          value={totalUsers}
          color="bg-blue-600"
        />
        <StatCard
          icon={Crown}
          title="Admins"
          value={adminUsers}
          color="bg-red-600"
        />
        <StatCard
          icon={Shield}
          title="Managers"
          value={managerUsers}
          color="bg-purple-600"
        />
        <StatCard
          icon={UserCheck}
          title="Regular Users"
          value={regularUsers}
          color="bg-green-600"
        />
      </div>

      {/* Filters and Search */}
      <div
        className="mb-6 p-6 rounded-2xl border border-[#21222d] shadow-lg"
        style={{ background: "#171821" }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-cyan-500 text-slate-100 border border-[#21222d]"
                style={{ background: "#21222d" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div
        className="rounded-2xl border border-[#21222d] shadow-lg overflow-hidden"
        style={{ background: "#171821" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: "#21222d" }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21222d]">
              {currentUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-[#21222d] transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ background: "#21222d" }}
                        >
                          <span className="text-sm font-medium text-slate-100">
                            {getInitials(user.username)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-100">
                            {user.username || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-400">
                        {user.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role?.toLowerCase() === "admin"
                            ? "bg-red-900 text-red-200"
                            : user.role?.toLowerCase() === "manager"
                            ? "bg-purple-900 text-purple-200"
                            : "bg-green-900 text-green-200"
                        }`}
                      >
                        {user.role
                          ? user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)
                          : "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewUser(user.id)}
                          className="text-cyan-400 hover:text-cyan-300 p-1"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-yellow-400 hover:text-yellow-300 p-1"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div
            className="px-6 py-4 border-t border-[#21222d]"
            style={{ background: "#171821" }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              {/* Items per page and info */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-400">Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) =>
                      handleItemsPerPageChange(Number(e.target.value))
                    }
                    className="px-3 py-1 rounded-lg focus:outline-none focus:border-cyan-500 text-slate-100 border border-[#21222d]"
                    style={{ background: "#21222d" }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-slate-400">entries</span>
                </div>
                <div className="text-sm text-slate-400">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredUsers.length)} of{" "}
                  {filteredUsers.length} entries
                </div>
              </div>

              {/* Pagination buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-[#21222d] text-slate-400 hover:text-slate-100 hover:bg-[#21222d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  style={{ background: "#171821" }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          currentPage === pageNumber
                            ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white"
                            : "border border-[#21222d] text-slate-400 hover:text-slate-100 hover:bg-[#21222d]"
                        }`}
                        style={
                          currentPage !== pageNumber
                            ? { background: "#171821" }
                            : {}
                        }
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-[#21222d] text-slate-400 hover:text-slate-100 hover:bg-[#21222d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  style={{ background: "#171821" }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View User Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-[#0000007c] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#171821] rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-100">User Details</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-slate-400 hover:text-slate-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400">Username</label>
                <p className="text-slate-100 font-medium">
                  {selectedUser.username || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm text-slate-400">Email</label>
                <p className="text-slate-100 font-medium">
                  {selectedUser.email || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm text-slate-400">Role</label>
                <p className="text-slate-100 font-medium">
                  {selectedUser.role
                    ? selectedUser.role.charAt(0).toUpperCase() +
                      selectedUser.role.slice(1).toLowerCase()
                    : "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm text-slate-400">ID</label>
                <p className="text-slate-100 font-medium">{selectedUser.id}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-[#0000007c] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#171821] rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-100">Edit User</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#21222d] border border-[#21222d] rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#21222d] border border-[#21222d] rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Role
                </label>
                <select
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({ ...editForm, role: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#21222d] border border-[#21222d] rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-lg hover:from-indigo-700 hover:to-cyan-700"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
