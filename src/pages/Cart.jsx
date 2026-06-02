import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { getCart, deleteCartItem, updateCart } from "../api/cart.api";
import ErrorState from "../components/ErrorState";
import { useAuth } from "../context/useAuth";
import Toast from "../components/Toast";

const Cart = () => {

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      setToast({ message: "Please login first 🔐", type: "error" });

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  }, [authLoading, user, navigate]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getCart();

      if (!res.success) {
        throw new Error(res.message);
      }

      const items = res.data?.items || [];

      const formattedItems = items.map(item => ({
        id: item?.productId?._id,
        title: item?.productId?.name,
        image: item?.productId?.image,
        price: item?.price,
        quantity: item?.quantity,
        size: item?.size || "M",
      }));

      setCartItems(formattedItems);

    } catch (err) {

      if (err?.message?.includes("Unauthorized")) {
        return;
      }

      setError(
        !navigator.onLine
          ? "No internet connection 🚫"
          : err.message || "Unable to load cart"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const handleRemove = async (productId, size) => {
    setCartItems(prev =>
      prev.filter(item => !(item.id === productId && item.size === size))
    );

    try {
      const res = await deleteCartItem(productId, size);
      if (!res.success) {
        return {
          success: false,
          message: res.message,
        };
      }
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  };

  const updateQuantity = async (productId, action, size) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === productId && item.size === size) {
          return {
            ...item,
            quantity: action === "increase" ? item.quantity + 1 : item.quantity - 1,
          };
        }
        return item;
      }).filter(item => item.quantity > 0)
    );

    try {
      const res = await updateCart({ productId, action, size });
      if (!res.success) {
        return {
          success: false,
          message: res.message,
        };
      }
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader text="Loading cart..." />
        <Footer />
      </>
    );
  }

  if (error && (cartItems?.length || 0) === 0) {
    return (
      <>
        <Navbar />
        <ErrorState message={error} onRetry={fetchCart} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Your Cart | Velnixa</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Navbar />

      <section className="bg-[#FAF8F5] min-h-screen px-4 sm:px-6 md:px-8 lg:px-16 py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center text-[#1F3D2B] mb-6 sm:mb-8 md:mb-10">
            Your Shopping Cart
          </h1>

          {(cartItems?.length || 0) === 0 ? (
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm p-8 sm:p-10 md:p-12 text-center max-w-2xl mx-auto">
              
              {/* Empty Cart Icon */}
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-gray-400" />
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Your cart is empty!
              </h2>
              
              <p className="text-gray-500 mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>

              {user && (
                <Link
                  to="/"
                  className="inline-block bg-[#2F6B4F] hover:bg-[#24563F] text-white px-8 py-3 rounded-xl text-sm font-medium transition-colors"
                >
                  Start Shopping 🛍️
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

              <div className="lg:col-span-2 space-y-4 md:space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm flex gap-4 sm:gap-5"
                  >
                    <Link to={`/products/${item.id}`} className="flex-shrink-0">
                      <img
                        src={item.image?.desktop || item.image}
                        alt={item.title}
                        className="w-24 sm:w-28 h-28 sm:h-32 object-cover rounded-xl"
                      />
                    </Link>

                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Size: <span className="font-medium">{item.size}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          ${item.price} each
                        </p>

                        <div className="flex items-center gap-3 mt-3 sm:mt-4">
                          <button
                            onClick={() => updateQuantity(item.id, "decrease", item.size)}
                            disabled={item.quantity === 1}
                            className="w-7 h-7 sm:w-8 sm:h-8 cursor-pointer flex items-center justify-center border border-[#1F3D2B] rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="font-medium text-sm sm:text-base">{item.quantity}</span>

                          <button
                            onClick={() => updateQuantity(item.id, "increase", item.size)}
                            disabled={item.quantity === 10}
                            className="w-7 h-7 sm:w-8 sm:h-8 cursor-pointer flex items-center justify-center border border-[#1F3D2B] rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:gap-2">
                        <p className="font-semibold text-gray-900 text-base sm:text-lg">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => handleRemove(item.id, item.size)}
                          className="text-gray-400 cursor-pointer hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm h-fit lg:sticky lg:top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 md:mb-6">
                  Order Summary
                </h2>

                <div className="flex justify-between text-gray-600 mb-3 text-sm sm:text-base">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600 mb-3 text-sm sm:text-base">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <div className="border-t pt-4 flex justify-between font-semibold text-gray-900 text-base sm:text-lg">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="mt-6 w-full cursor-pointer bg-[#2F6B4F] hover:bg-[#24563F] text-white py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {toast && (
        <div className="fixed top-5 right-5 z-50">
          <Toast message={toast.message} type={toast.type} />
        </div>
      )}
      
      <Footer />
    </>
  );
};

export default Cart;