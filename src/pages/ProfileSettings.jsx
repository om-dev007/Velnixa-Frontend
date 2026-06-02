import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import Toast from "../components/Toast";
import Footer from "../components/Footer";
import { useAuth } from "../context/useAuth";
import { updateUser, deleteUser } from "../api/user.api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfileSettings = () => {
  const { user, loading, logout } = useAuth();

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState([]);

  const showToast = (message, type) => {
    const id = Date.now();

    setToast((prev) => [
      ...prev,
      { id, message, type },
    ]);

    setTimeout(() => {
      setToast((prev) =>
        prev.filter((t) => t.id !== id)
      );
    }, 2500);
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user, loading, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await updateUser(user._id, {
        name,
        email,
      });

      showToast(
        "Profile updated successfully ✅",
        "success"
      );

    } catch {
      showToast(
        "Unable to update profile ❌",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete your account?"
      );

    if (!confirmDelete) return;

    try {

      await deleteUser(user.id);

      await logout();

      showToast(
        "Account deleted successfully",
        "success"
      );

      setTimeout(() => {
        navigate("/");
      }, 1200);

    } catch {

      showToast(
        "Unable to delete account",
        "error"
      );
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader text="Loading profile..." />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-[#FAF8F5] px-5 md:px-12 py-10">

        <div className="max-w-3xl mx-auto">

          <div className="bg-white rounded-3xl shadow-sm p-8">

            <h1 className="text-3xl font-bold text-[#1F3D2B] mb-2">
              Profile Settings
            </h1>

            <p className="text-gray-500 mb-8">
              Manage your account information
            </p>

            <form
              onSubmit={handleUpdate}
              className="space-y-6"
            >

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2F6B4F]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2F6B4F]"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="cursor-pointer bg-[#2F6B4F] hover:bg-[#24563F] text-white px-8 py-3 rounded-xl font-medium transition"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </form>

            <div className="mt-12 border-t pt-8">

              <h2 className="text-xl font-semibold text-red-600 mb-3">
                Danger Zone
              </h2>

              <p className="text-gray-500 mb-5">
                Permanently delete your account.
              </p>

              <button
                onClick={handleDeleteAccount}
                className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition"
              >
                Delete Account
              </button>

            </div>

          </div>

        </div>

      </section>

      <div className="fixed top-5 right-5 flex flex-col gap-3 z-50">
        {toast.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
          />
        ))}
      </div>

      <Footer />
    </>
  );
};

export default ProfileSettings;