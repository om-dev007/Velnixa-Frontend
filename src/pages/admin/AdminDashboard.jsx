import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import {
  FiPackage,
  FiUsers,
  FiShoppingCart,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiLogOut,
  FiGrid,
  FiList,
  FiDollarSign,
  FiSettings,
} from "react-icons/fi";
import { getAllProducts, getAllUsers, deleteOneUser, deleteProduct } from "../../api/admin.api";
import Toast from "../../components/Toast";
import Loader from "../../components/Loader";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Helmet } from "react-helmet-async";

const AdminDashboard = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/login");
      } else if (user.role !== "admin") {
        navigate("/");
      }
    }
  }, [authLoading, user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch products
      const productsRes = await getAllProducts();

      if (productsRes.success) {
        setProducts(productsRes.data || []);
      } else {
        console.error("Failed to fetch products:", productsRes.message);
      }

      // Fetch users
      const usersRes = await getAllUsers();

      if (usersRes.success) {
        setUsers(usersRes.data || []);
      } else {
        console.error("Failed to fetch users:", usersRes.message);
      }

    } catch (error) {
      console.error("Error fetching admin data:", error);
      setToast({ message: "Error fetching data", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchData();
    }
  }, [user]);

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await deleteProduct(productId);
      if (res.success) {
        setToast({ message: "Product deleted successfully!", type: "success" });
        fetchData(); // Refresh data
      } else {
        setToast({ message: res.message || "Failed to delete product", type: "error" });
      }
    } catch {
      setToast({ message: "Error deleting product", type: "error" });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await deleteOneUser(userId);
      if (res.success) {
        setToast({ message: "User deleted successfully!", type: "success" });
        fetchData(); // Refresh data
      } else {
        setToast({ message: res.message || "Failed to delete user", type: "error" });
      }
    } catch {
      setToast({ message: "Error deleting user", type: "error" });
    }
  };

  const stats = [
    { title: "Total Products", value: products.length, icon: <FiPackage size={24} />, bgColor: "bg-blue-50", textColor: "text-blue-600" },
    { title: "Total Users", value: users.length, icon: <FiUsers size={24} />, bgColor: "bg-green-50", textColor: "text-green-600" },
    { title: "Total Orders", value: "--", icon: <FiShoppingCart size={24} />, bgColor: "bg-orange-50", textColor: "text-orange-600" },
    { title: "Revenue", value: "--", icon: <FiDollarSign size={24} />, bgColor: "bg-purple-50", textColor: "text-purple-600" },
  ];

  const quickActions = [
    { title: "Add Product", description: "Create a new product", icon: <FiPlus size={20} />, action: () => navigate("/admin/products/new"), color: "bg-green-500" },
    { title: "View All Products", description: "Manage your inventory", icon: <FiList size={20} />, action: () => setActiveTab("products"), color: "bg-blue-500" },
    { title: "View All Users", description: "Manage customers", icon: <FiUsers size={20} />, action: () => setActiveTab("users"), color: "bg-purple-500" },
    { title: "Settings", description: "Admin preferences", icon: <FiSettings size={20} />, action: () => navigate("/admin/settings"), color: "bg-gray-500" },
  ];

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <Loader text="Loading admin dashboard..." />
        <Footer />
      </>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Velnixa</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Navbar />

      <section className="min-h-screen bg-[#FAF8F5] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Admin Header */}
          <div className="rounded-2xl sm:rounded-3xl bg-linear-to-r from-[#1F3D2B] via-[#2F6B4F] to-[#3A8060] text-white p-5 sm:p-6 md:p-8 lg:p-10 shadow-xl mb-6 sm:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-xs sm:text-sm uppercase tracking-wider text-white/70 mb-1">Admin Panel</p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Welcome, {user?.name?.toUpperCase()}</h1>
                <p className="text-white/80 text-sm sm:text-base max-w-xl">Manage products, users, orders, and monitor your store's performance.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl sm:text-2xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <button
                  onClick={async () => {
                    await logout();
                    navigate("/login");
                  }}
                  className="bg-white/20 cursor-pointer hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
                >
                  <FiLogOut size={16} /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className={`p-2 rounded-xl ${stat.bgColor} w-fit mb-3`}>
                  <div className={stat.textColor}>{stat.icon}</div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">{stat.title}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 shadow-sm border border-gray-100 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <button key={index} onClick={action.action} className="group cursor-pointer rounded-xl p-4 text-left hover:shadow-md transition-all border border-gray-100">
                  <div className={`w-10 h-10 rounded-xl ${action.color} bg-opacity-10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <div className={`${action.color.replace("bg-", "text-")}`}>{action.icon}</div>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{action.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              <button onClick={() => setActiveTab("overview")} className={`px-4 sm:px-6 py-3 text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${activeTab === "overview" ? "text-[#2F6B4F] border-b-2 border-[#2F6B4F]" : "text-gray-500 hover:text-gray-700"}`}>
                <FiGrid className="inline mr-2" size={16} /> Overview
              </button>
              <button onClick={() => setActiveTab("products")} className={`px-4 sm:px-6 py-3 cursor-pointer text-sm font-medium whitespace-nowrap transition-all ${activeTab === "products" ? "text-[#2F6B4F] border-b-2 border-[#2F6B4F]" : "text-gray-500 hover:text-gray-700"}`}>
                <FiPackage className="inline mr-2" size={16} /> Products ({products.length})
              </button>
              <button onClick={() => setActiveTab("users")} className={`px-4 sm:px-6 cursor-pointer py-3 text-sm font-medium whitespace-nowrap transition-all ${activeTab === "users" ? "text-[#2F6B4F] border-b-2 border-[#2F6B4F]" : "text-gray-500 hover:text-gray-700"}`}>
                <FiUsers className="inline mr-2" size={16} /> Users ({users.length})
              </button>
            </div>

            <div className="p-4 sm:p-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Recent Products</h3>
                    <div className="space-y-2">
                      {products.slice(0, 5).map((product) => (
                        <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">${product.price}</p>
                          </div>
                          <button onClick={() => navigate(`/products/${product._id}`)} className="text-[#2F6B4F] cursor-pointer">
                            <FiEye size={18} />
                          </button>
                        </div>
                      ))}
                      {products.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No products yet. Click "Add Product" to create one.</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Recent Users</h3>
                    <div className="space-y-2">
                      {users.slice(0, 5).map((u) => (
                        <div key={u._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-medium text-gray-900">{u.name}</p>
                            <p className="text-sm text-gray-500">{u.email}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"
                            }`}>
                            {u.role || "user"}
                          </span>
                        </div>
                      ))}
                      {users.length === 0 && <p className="text-gray-500 text-center py-4">No users yet</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Products Tab */}
              {activeTab === "products" && (
                <div>
                  <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">All Products</h3>
                    <button onClick={() => navigate("/admin/products/new")} className="bg-[#2F6B4F] hover:bg-[#24563F] text-white cursor-pointer px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
                      <FiPlus size={16} /> Add Product
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-3 font-medium text-gray-600">Image</th>
                          <th className="text-left p-3 font-medium text-gray-600">Name</th>
                          <th className="text-left p-3 font-medium text-gray-600">Price</th>
                          <th className="text-left p-3 font-medium text-gray-600">Category</th>
                          <th className="text-left p-3 font-medium text-gray-600">Section</th>
                          <th className="text-left p-3 font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3">
                              <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                            </td>
                            <td className="p-3 font-medium text-gray-900">{product.name}</td>
                            <td className="p-3">${product.price}</td>
                            <td className="p-3">
                              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{product.category}</span>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{product.section}</span>
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <button onClick={() => navigate(`/admin/products/edit/${product._id}`)} className="text-blue-600 cursor-pointer">
                                  <FiEdit size={16} />
                                </button>
                                <button onClick={() => handleDeleteProduct(product._id)} className="text-red-600 cursor-pointer">
                                  <FiTrash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {products.length === 0 && (
                          <tr>
                            <td colSpan="6" className="text-center p-8 text-gray-500">
                              No products found. Click "Add Product" to create one.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === "users" && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">All Users</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-3 font-medium text-gray-600">Name</th>
                          <th className="text-left p-3 font-medium text-gray-600">Email</th>
                          <th className="text-left p-3 font-medium text-gray-600">Role</th>
                          <th className="text-left p-3 font-medium text-gray-600">Verified</th>
                          <th className="text-left p-3 font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 font-medium text-gray-900">{u.name}</td>
                            <td className="p-3 text-gray-600">{u.email}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"
                                }`}>
                                {u.role || "user"}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${u.isVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                }`}>
                                {u.isVerified ? "Verified" : "Pending"}
                              </span>
                            </td>
                            <td className="p-3">
                              <button onClick={() => handleDeleteUser(u._id)} className="text-red-600" disabled={u.role === "admin"}>
                                <FiTrash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {users.length === 0 && (
                          <tr>
                            <td colSpan="5" className="text-center p-8 text-gray-500">
                              No users found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {toast && (
        <div className="fixed top-5 right-5 z-50">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      <Footer />
    </>
  );
};

export default AdminDashboard;