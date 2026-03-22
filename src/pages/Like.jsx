import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import Toast from "../components/Toast";
import { useState, useEffect } from "react";
import { Trash2, ShoppingCart } from "lucide-react";
import Loader from "../components/Loader";        // ✅ added
import ErrorState from "../components/ErrorState"; // ✅ added

const Like = () => {

  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);   // ✅ added
  const [error, setError] = useState(null);       // ✅ added

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("https://velnixa-backend.onrender.com/wishlist", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error();
      }

      const formatted = data.wishlist.items.map(item => ({
        id: item.productId._id,
        title: item.productId.name,
        price: item.productId.price,
        image: item.productId.image,
      }));

      setWishlist(formatted);

    } catch (error) {
      setError(
        !navigator.onLine
          ? "No internet connection 🚫"
          : "Unable to load wishlist 😕"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    try {

      const res = await fetch(
        `https://velnixa-backend.onrender.com/wishlist/${productId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error();

      setWishlist(prev =>
        prev.filter(item => item.id !== productId)
      );

      setToast({
        message: "Removed from wishlist ❌",
        type: "success",
      });

    } catch {
      setToast({
        message: "Error removing ❌",
        type: "error",
      });
    } finally {
      setTimeout(() => setToast(null), 1500);
    }
  };

  const handleAddToCart = async (productId) => {
    try {

      const res = await fetch("https://velnixa-backend.onrender.com/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId,
          quantity: 1,
          size: "M"
        })
      });

      if (!res.ok) throw new Error();

      setToast({
        message: "Added to cart 🛒",
        type: "success",
      });

    } catch {
      setToast({
        message: "Error adding to cart ❌",
        type: "error",
      });
    } finally {
      setTimeout(() => setToast(null), 1500);
    }
  };

  // 🔥 LOADING
  if (loading) {
    return (
      <>
        <Navbar />
        <Loader text="Loading wishlist..." />
        <Footer />
      </>
    );
  }

  // 🔥 ERROR
  if (error) {
    return (
      <>
        <Navbar />
        <ErrorState message={error} onRetry={fetchWishlist} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="bg-[#FAF8F5] min-h-screen px-6 md:px-16 py-12">
        <h1 className="text-3xl font-semibold text-center mb-10">
          Your Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <p className="text-center text-gray-500">
            No liked products yet
          </p>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">

            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition duration-300 flex gap-4 items-center"
              >

                <Link to={`/products/${item.id}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-28 rounded-xl object-cover"
                  />
                </Link>

                <div className="flex-1 space-y-2">

                  <h3 className="font-semibold text-gray-900 leading-tight">
                    {item.title}
                  </h3>

                  <p className="text-lg font-bold text-[#1F3D2B]">
                    ${item.price}
                  </p>

                  <div className="flex gap-3 mt-3 flex-wrap">

                    <button
                      onClick={() => handleAddToCart(item.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg
                      bg-[#2F6B4F] hover:bg-[#24563F] text-white text-sm transition"
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>

                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg
                      bg-red-50 hover:bg-red-100 text-red-600 text-sm transition"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}
      </section>

      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-toast-in">
          <Toast message={toast.message} type={toast.type} />
        </div>
      )}

      <Footer />
    </>
  );
};

export default Like;