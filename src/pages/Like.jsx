import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import Toast from "../components/Toast";
import { useState, useEffect } from "react";
import { Trash2, ShoppingCart } from "lucide-react";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import { getWishlist, removeFromWish } from "../api/wishlist.api";
import { addToCart } from "../api/cart.api";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

const Like = () => {

  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      setToast({ message: "Please login first 🔐", type: "error" });

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  }, [authLoading, user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getWishlist();

      if (!res.success) {
        throw new Error(res.message);
      }

      const items = res.data?.items || [];

      const formatted = items
        .filter(item => item?.productId)
        .map(item => ({
          id: item.productId._id,
          title: item.productId.name,
          price: item.productId.price,
          image: item.productId.image,
        }));

      setWishlist(formatted);

    } catch {
      setError(!navigator.onLine ? "No internet connection 🚫" : "Unable to load wishlist 😕");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const removeFromWishlist = async (productId) => {
    try {
      await removeFromWish(productId);

      setWishlist(prev => prev.filter(item => item.id !== productId));

      setToast({ message: "Removed from wishlist ❌", type: "success" });

    } catch {
      setToast({ message: "Error removing ❌", type: "error" });
    } finally {
      setTimeout(() => setToast(null), 1500);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart({
        productId,
        quantity: 1,
        size: "M"
      });

      setToast({ message: "Added to cart 🛒", type: "success" });

    } catch {
      setToast({ message: "Error adding to cart ❌", type: "error" });
    } finally {
      setTimeout(() => setToast(null), 1500);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader text="Loading wishlist..." />
        <Footer />
      </>
    );
  }

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

      <section className="bg-[#FAF8F5] min-h-screen px-5 sm:px-8 md:px-12 lg:px-20 py-10 sm:py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-8 sm:mb-10 md:mb-12">
            Your Wishlist
          </h1>

          {(wishlist?.length || 0) === 0 ? (
            <div className="flex flex-col items-center justify-center mt-16 sm:mt-20 md:mt-24 gap-5 px-4">
              <p className="text-gray-500 text-base sm:text-lg text-center">
                No liked products yet
              </p>

              {user && (
                <Link
                  to="/"
                  className="bg-[#2F6B4F] hover:bg-[#24563F] text-white px-8 sm:px-10 py-3 rounded-xl text-sm sm:text-base font-medium shadow-sm transition-all duration-200"
                >
                  Start Shopping 🛍️
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              {(wishlist || []).map((item) => (
                <div
                  key={item.id}
                  className="
                    bg-white
                    rounded-3xl
                    overflow-hidden
                    shadow-sm
                    hover:shadow-xl
                    transition-all
                    duration-300
                    border
                    border-gray-100
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    p-4 sm:p-5 md:p-6
                    gap-4 sm:gap-6
                  "
                >
                  {/* Product Image */}
                  <Link 
                    to={`/products/${item.id}`} 
                    className="sm:w-32 md:w-36 lg:w-40 shrink-0 block"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="
                        w-full
                        h-48 sm:h-28 md:h-32
                        object-cover
                        rounded-xl
                        bg-gray-50
                      "
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 space-y-2 sm:space-y-1">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg md:text-xl leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-2xl sm:text-2xl md:text-3xl font-bold text-[#1F3D2B]">
                      ${item.price}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row sm:flex-col gap-2 sm:gap-2.5 sm:w-32 md:w-36">
                    <button
                      onClick={() => handleAddToCart(item.id)}
                      className="
                        flex-1 sm:w-full
                        flex
                        justify-center
                        items-center
                        gap-2
                        px-4 sm:px-3
                        py-2.5 sm:py-2 md:py-2.5
                        rounded-xl
                        bg-[#2F6B4F]
                        hover:bg-[#24563F]
                        text-white
                        transition-all
                        duration-200
                        text-sm
                        font-medium
                      "
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>

                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="
                        flex-1 sm:w-full
                        flex
                        justify-center
                        items-center
                        gap-2
                        px-4 sm:px-3
                        py-2.5 sm:py-2 md:py-2.5
                        rounded-xl
                        bg-red-50
                        hover:bg-red-100
                        text-red-600
                        transition-all
                        duration-200
                        text-sm
                        font-medium
                      "
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {toast && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 w-auto max-w-[90vw] sm:top-5 sm:right-5 sm:left-auto sm:transform-none animate-toast-in">
          <Toast message={toast.message} type={toast.type} />
        </div>
      )}

      <Footer />
    </>
  );
};

export default Like;