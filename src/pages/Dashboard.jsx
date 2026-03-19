import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Dashboard = () => {

    const { user, loading, logout } = useAuth();

    const navigate = useNavigate()
    const [toast, setToast] = useState([])
    
    const showToast = (message, type) => {

        const id = Date.now();

        setToast((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToast((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    };

    if (!loading && !user) {
        showToast("Plese login first to see your dashboard", "error")
        navigate("/login");
    }


    if (loading) {
        return <div>Loading...</div>;
    }

    console.log("User dashboard:", user);

    return (
        <>
            <Navbar />

            <section className="bg-[#FAF8F5] min-h-screen px-6 md:px-16 py-12">

                <h1 className="text-3xl font-semibold text-[#1F3D2B] mb-8">
                    Your Dashboard
                </h1>

                <div className="max-w-4xl bg-white rounded-2xl shadow-sm p-8">

                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Welcome, {user?.name || "User"}
                    </h2>

                    <p className="text-gray-600 mb-6">
                        Manage your profile, orders, and account settings.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                        <div className="border rounded-xl p-5 hover:shadow-md transition">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Orders
                            </h3>
                            <p className="text-sm text-gray-500">
                                Track your orders and history
                            </p>
                        </div>

                        <div className="border rounded-xl p-5 hover:shadow-md transition">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Wishlist
                            </h3>
                            <p className="text-sm text-gray-500">
                                Products you liked
                            </p>
                        </div>

                        <div className="border rounded-xl p-5 hover:shadow-md transition">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Profile
                            </h3>
                            <p className="text-sm text-gray-500">
                                Update your account details
                            </p>
                        </div>

                        <div className="border rounded-xl p-5 hover:shadow-md transition">
                            <h3 className="font-semibold text-gray-900 mb-2">
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
                            showToast("Logout successfully", "success")
                            setTimeout(() => {navigate("/login");}, 2000)
                        }}
                        className="mt-8 cursor-pointer bg-[#2F6B4F] hover:bg-[#24563F] text-white px-6 py-2 rounded-lg"
                    >
                        Logout
                    </button>

                </div>

            </section>
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