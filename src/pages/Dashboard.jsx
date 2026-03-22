import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Dashboard = () => {

  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [toast, setToast] = useState([]);

  const showToast = (message, type) => {
    const id = Date.now();
    setToast((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToast((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  useEffect(() => {
    if (!loading && !user) {
      showToast("Please login first", "error");
      navigate("/login");
    }
  }, [loading, user]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader text="Loading dashboard..." />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="bg-[#FAF8F5] min-h-screen px-6 md:px-16 py-12">

        <h1 className="text-3xl font-semibold text-[#1F3D2B] mb-8">
          Your Dashboard
        </h1>

        <div className="max-w-4xl bg-white rounded-3xl shadow-sm p-8">

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              Welcome, {user?.name || "User"} 👋
            </h2>
            <p className="text-gray-500 mt-1">
              Manage your account, orders & preferences
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div
              onClick={() => navigate("/checkout")}
              className="group p-6 rounded-2xl bg-linear-to-br from-[#FAF8F5] to-white 
              hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer"
            >
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#2F6B4F]">
                Orders
              </h3>
              <p className="text-sm text-gray-500">
                Track your orders and history
              </p>
            </div>

            <div
              onClick={() => navigate("/like")}
              className="group p-6 rounded-2xl bg-linear-to-br from-[#FAF8F5] to-white 
              hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer"
            >
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#2F6B4F]">
                Wishlist
              </h3>
              <p className="text-sm text-gray-500">
                Products you liked
              </p>
            </div>

            <div
              onClick={() => navigate("/user")}
              className="group p-6 rounded-2xl bg-linear-to-br from-[#FAF8F5] to-white 
              hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer"
            >
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#2F6B4F]">
                Profile
              </h3>
              <p className="text-sm text-gray-500">
                Update your account details
              </p>
            </div>

            <div
              onClick={() => navigate("/user")}
              className="group p-6 rounded-2xl bg-linear-to-br from-[#FAF8F5] to-white 
              hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer"
            >
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#2F6B4F]">
                Settings
              </h3>
              <p className="text-sm text-gray-500">
                Manage account preferences
              </p>
            </div>

          </div>

          <button
            onClick={async () => {
              await logout();
              showToast("Logout successfully", "success");
              setTimeout(() => navigate("/login"), 1500);
            }}
            className="mt-10 cursor-pointer w-full sm:w-auto bg-[#2F6B4F] hover:bg-[#24563F] 
            text-white px-8 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition"
          >
            Logout
          </button>

        </div>

      </section>

      {/* TOAST */}
      <div className="fixed top-5 right-5 flex flex-col gap-3 z-50">
        {toast.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onClose={() =>
              setToast((prev) =>
                prev.filter((toast) => toast.id !== t.id)
              )
            }
          />
        ))}
      </div>

      <Footer />
    </>
  );
};

export default Dashboard;