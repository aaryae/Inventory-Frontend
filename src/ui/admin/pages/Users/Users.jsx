import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  Hash,
  Mail,
  Pencil,
  Plus,
  Save,
  Search,
  Shield,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { signUp } from "../../../../services/auth/authService";
import {
  deleteUser,
  getUserById,
  getUsers,
  
} from "../../../../services/user/usersService";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUserConfirm, setShowUserConfirm] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const [usersPerPage] = useState(10);
  const [addForm, setAddForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });


  useEffect(() => {
    const name = localStorage.getItem("username") || "User";
    console.log("Logged In Username:", name);

    if (name === "admin") {
      setIsAdmin(true);
    }
  }, []);
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



  const handleDeleteUser = async (userId) => {
    try {
      const response = await deleteUser(userId);
      if (response.success) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        toast.error(response.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };


  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await signUp(addForm);
      if (
        response.success ||
        response.message === "User registered successfully"
      ) {
        toast.success("User created successfully");
        setShowAddModal(false);
        setAddForm({
          username: "",
          email: "",
          password: "",
          role: "",
        });
        fetchUsers();
      } else {
        toast.error(response.message || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(error.response?.data?.message || "Failed to create user");
    } finally {
      setIsCreating(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });


  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase() || "U"
    );
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "manager":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default:
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    }
  };

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
          { isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 sm:mt-0 flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add New User</span>
          </button>
          )}
        </div>
      </div>


      <div
        className="mb-6 p-6 rounded-2xl border border-[#21222d] shadow-lg"
        style={{ background: "#171821" }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">

          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-cyan-500 text-slate-100 border border-[#21222d]"
                style={{ background: "#21222d" }}
              />
            </div>
          </div>
        </div>
      </div>


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
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getRoleColor(
                          user.role
                        )}`}
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
                          className="text-cyan-400 hover:text-cyan-300 p-1 hover:bg-cyan-400/10 rounded transition-all"
                          title="View User"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => {
                              setUserIdToDelete(user.id);
                              setShowUserConfirm(true);
                            }}
                            className="text-red-400 hover:text-red-300 p-1 hover:bg-red-400/10 rounded transition-all"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {showUserConfirm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full">
                <h2 className="text-lg font-semibold text-gray-800">Confirm Delete</h2>
                <p className="text-gray-600 mt-2">
                  Are you sure you want to delete this user? This action cannot be undone.
                </p>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowUserConfirm(false)}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"   >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteUser(userIdToDelete);
                      setShowUserConfirm(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[#21222d]">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
            </div>

            {totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-[#21222d] border border-[#21222d] disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                  style={{ background: "#171821" }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  const isCurrentPage = page === currentPage;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg text-sm border transition-colors ${isCurrentPage
                          ? "bg-gradient-to-r from-indigo-600 to-cyan-600 border-transparent text-white"
                          : "text-slate-300 hover:bg-[#21222d] border-[#21222d] bg-[#171821]"
                          }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="px-2 text-slate-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-[#21222d] border border-[#21222d] disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                  style={{ background: "#171821" }}
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#171821] rounded-3xl border border-[#21222d] shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">

            <div className="bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 border-b border-[#21222d] p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {getInitials(selectedUser.username)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-100 mb-4">
                      User Details
                    </h3>
                    <p className="text-slate-400 mb-6">
                      View user information
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <div className="p-4 rounded-xl border border-cyan-500/20 bg-gradient-to-r from-cyan-900/20 to-indigo-900/20">
                        <label className="text-sm text-slate-300">Username</label>
                        <p className="text-lg font-semibold text-slate-100">
                          {selectedUser.username || "N/A"}
                        </p>
                      </div>


                      <div className="p-4 rounded-xl border border-cyan-500/20 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
                        <label className="text-sm text-slate-300">Email</label>
                        <p className="text-lg font-semibold text-slate-100">
                          {selectedUser.email || "No email provided"}
                        </p>
                      </div>
                    </div>


                    <div className="mt-4">
                      <div className="p-4 rounded-xl border border-cyan-500/20 bg-gradient-to-r from-emerald-900/20 to-teal-900/20">
                        <label className="text-sm text-slate-300">Role</label>
                        <p className="mt-1">
                          <span
                            className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getRoleColor(
                              selectedUser.role
                            )}`}
                          >
                            {selectedUser.role
                              ? selectedUser.role.charAt(0).toUpperCase() +
                              selectedUser.role.slice(1)
                              : "Role not assigned"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="text-slate-400 hover:text-slate-300 p-2 hover:bg-slate-700/50 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAddModal &&  (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#171821] rounded-3xl border border-[#21222d] shadow-2xl w-full max-w-md mx-4 overflow-hidden">

            <div className="bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 border-b border-[#21222d] p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-100">
                      Add New User
                    </h3>
                    <p className="text-slate-400">Create a new user account</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-300 p-2 hover:bg-slate-700/50 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>


            <div className="p-6">
              <form onSubmit={handleAddUser} className="space-y-6">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-300 mb-3">
                    <User className="w-4 h-4 text-cyan-400" />
                    <span>Username</span>
                  </label>
                  <input
                    type="text"
                    value={addForm.username}
                    onChange={(e) =>
                      setAddForm({ ...addForm, username: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#21222d] border border-[#2a2b36] rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-300 mb-3">
                    <Mail className="w-4 h-4 text-emerald-400" />
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    value={addForm.email}
                    onChange={(e) =>
                      setAddForm({ ...addForm, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#21222d] border border-[#2a2b36] rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-300 mb-3">
                    <Shield className="w-4 h-4 text-red-400" />
                    <span>Password</span>
                  </label>
                  <input
                    type="password"
                    value={addForm.password}
                    onChange={(e) =>
                      setAddForm({ ...addForm, password: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#21222d] border border-[#2a2b36] rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    placeholder="Enter password"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-slate-300 mb-3">
                    <Shield className="w-4 h-4 text-yellow-400" />
                    <span>Role</span>
                  </label>
                  <select
                    value={addForm.role}
                    onChange={(e) =>
                      setAddForm({ ...addForm, role: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#21222d] border border-[#2a2b36] rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-[#21222d]">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-xl transition-all duration-200 flex items-center space-x-2"
                    disabled={isCreating}
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white rounded-xl transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Create User</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
