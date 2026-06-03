import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import Loader from "../components/Loader";
import { getWishlist } from "../api/wishlist.api";
import { getCart } from "../api/cart.api";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

import {
  FiHeart,
  FiUser,
  FiSettings,
  FiLogOut,
  FiPackage,
  FiMail,
} from "react-icons/fi";

const UserDashboard = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        const [wishlistRes, cartRes] = await Promise.all([
          getWishlist(),
          getCart(),
        ]);

        const wishlistItems = wishlistRes?.data?.items || [];
        const cartItems = cartRes?.data?.items || [];

        setWishlistCount(wishlistItems.filter(item => item?.productId).length);
        setCartCount(cartItems.filter(item => item?.productId).length);
      } catch (err) {
        console.log("Error in userdashboard: ", err);
      }
    };

    fetchStats();
  }, [user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader text="Loading dashboard..." />
        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  // Agar admin hai to redirect to admin dashboard
  if (user.role === "admin") {
    navigate("/admin/dashboard");
    return null;
  }

  const quickActions = [
    {
      title: "Orders",
      description: "Track and manage your orders",
      icon: <FiPackage size={22} />,
      path: "/checkout",
    },
    {
      title: "Wishlist",
      description: "View your favourite products",
      icon: <FiHeart size={22} />,
      path: "/like",
    },
    {
      title: "Profile",
      description: "Update your personal details",
      icon: <FiUser size={22} />,
      path: "/profile",
    },
    {
      title: "Settings",
      description: "Manage account preferences",
      icon: <FiSettings size={22} />,
      path: "/user",
    },
  ];

  return (
    <>
      <Helmet>
        <title>My Dashboard | Velnixa</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Navbar />

      <section className="min-h-screen bg-[#FAF8F5] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto">
          {/* HERO SECTION */}
          <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#1F3D2B] via-[#2F6B4F] to-[#3A8060] text-white p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
              <div className="flex-1">
                <p className="text-xs sm:text-sm uppercase tracking-wider text-white/70 mb-1 sm:mb-2">
                  Dashboard
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4">
                  Welcome Back,
                  <span className="block mt-1 sm:mt-2">
                    {user?.name?.toUpperCase()}
                  </span>
                </h1>
                <p className="text-white/80 text-sm sm:text-base max-w-xl leading-relaxed">
                  Manage your profile, wishlist, orders and account settings from one place.
                </p>
              </div>
              <div className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold shrink-0 self-center md:self-auto">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mt-6 sm:mt-7 md:mt-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 shadow-sm border border-gray-100">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-5 md:mb-6">
                Account Information
              </h2>
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">Full Name</p>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    {user?.name?.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">Email Address</p>
                  <div className="flex items-center gap-2 text-gray-900 font-medium text-sm sm:text-base break-all">
                    <FiMail className="shrink-0" />
                    <span className="break-all">{user?.email}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">Account Type</p>
                  <span className="inline-flex px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-green-100 text-green-700 text-xs sm:text-sm font-medium">
                    Customer
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100">
                <p className="text-gray-500 text-xs sm:text-sm">Orders</p>
                <h3 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 text-[#1F3D2B]">--</h3>
                <p className="text-xs text-gray-400 mt-1 sm:mt-2">Coming Soon</p>
              </div>
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100">
                <p className="text-gray-500 text-xs sm:text-sm">Wishlist</p>
                <h3 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 text-[#1F3D2B]">{wishlistCount}</h3>
              </div>
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100">
                <p className="text-gray-500 text-xs sm:text-sm">Cart Items</p>
                <h3 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 text-[#1F3D2B]">{cartCount}</h3>
              </div>
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100">
                <p className="text-gray-500 text-xs sm:text-sm">Status</p>
                <h3 className="text-base sm:text-lg md:text-xl font-bold mt-2 sm:mt-3 text-green-600">Active</h3>
                <p className="text-xs text-gray-400 mt-1 sm:mt-2">Account Verified</p>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="mt-6 sm:mt-7 md:mt-8 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 shadow-sm border border-gray-100">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-5 md:mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {quickActions.map((item) => (
                <div
                  key={item.title}
                  onClick={() => navigate(item.path)}
                  className="group cursor-pointer rounded-2xl sm:rounded-3xl border border-gray-100 p-4 sm:p-5 md:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl sm:rounded-2xl bg-[#EEF6F1] flex items-center justify-center text-[#2F6B4F] mb-3 sm:mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base group-hover:text-[#2F6B4F] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ACCOUNT ACTIONS */}
          <div className="mt-6 sm:mt-7 md:mt-8 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 shadow-sm border border-gray-100">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-5 md:mb-6">Account Actions</h2>
            <button
              onClick={async () => {
                await logout();
                showToast("Logout Successfully", "success");
                setTimeout(() => {
                  navigate("/login");
                }, 1200);
              }}
              className="cursor-pointer flex items-center justify-center sm:justify-start gap-2 sm:gap-3 bg-[#1F3D2B] hover:bg-[#173021] text-white px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl font-medium transition-all text-sm sm:text-base w-full sm:w-auto"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </section>

      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      <Footer />
    </>
  );
};

export default UserDashboard;