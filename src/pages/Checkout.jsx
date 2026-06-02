import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CreditCard, Wallet, Truck } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import { getCart } from "../api/cart.api";
import { useAuth } from "../context/useAuth";
import { useNavigate, Link } from "react-router-dom";

const Checkout = () => {

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  const [paymentMethod, setPaymentMethod] = useState("");

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
        price: item?.price,
        quantity: item?.quantity,
        image: item?.productId?.image,
      }));

      setCartItems(formattedItems);

    } catch (err) {
      setError(
        !navigator.onLine
          ? "No internet connection 🚫"
          : err.message || "Unable to load checkout 😕"
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

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <Loader text="Loading checkout..." />
        <Footer />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Navbar />
        <ErrorState message={error} onRetry={fetchCart} />
        <Footer />
      </>
    );
  }

  // ✅ Empty cart state - User ko button dikhao, click kare tabhi redirect
  if (cartItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>Empty Cart | Velnixa</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <Navbar />

        <section className="min-h-screen bg-[#FAF8F5] px-4 sm:px-6 md:px-8 lg:px-16 py-6 sm:py-8 md:py-10 lg:py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm p-8 sm:p-10 md:p-12">
              
              {/* Empty Cart Icon */}
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg 
                  className="w-10 h-10 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Your cart is empty!
              </h2>
              
              <p className="text-gray-500 mb-8">
                Looks like you haven't added anything to your cart yet.
              </p>

              <Link
                to="/"
                className="inline-block bg-[#2F6B4F] hover:bg-[#24563F] text-white px-8 py-3 rounded-xl text-sm font-medium transition-colors"
              >
                Continue Shopping 🛍️
              </Link>

            </div>
          </div>
        </section>

        <Footer />
      </>
    );
  }

  // Main checkout view (with items)
  return (
    <>
      <Helmet>
        <title>Checkout | Secure Payment | Velnixa</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Navbar />

      <section className="min-h-screen bg-[#FAF8F5] px-4 sm:px-6 md:px-8 lg:px-16 py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="max-w-4xl mx-auto">

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1F3D2B] text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            Checkout
          </h1>

          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm p-4 sm:p-6 md:p-8 lg:p-10">

            {/* Order Summary */}
            <div className="mb-6 sm:mb-8 md:mb-10">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-5 md:mb-6">
                Order Summary ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
              </h2>

              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                {cartItems.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex items-center gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-gray-100 last:border-0"
                  >
                    <Link to={`/products/${item.id}`} className="flex-shrink-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-lg bg-gray-50 hover:opacity-80 transition-opacity cursor-pointer"
                        />
                      )}
                    </Link>
                    
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.id}`} className="hover:text-[#2F6B4F] transition-colors">
                        <p className="font-medium text-sm sm:text-base text-gray-900 hover:text-[#2F6B4F] truncate">
                          {item.title}
                        </p>
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold text-sm sm:text-base text-gray-900 flex-shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6 sm:mb-8 md:mb-10">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-5 md:mb-6">
                Payment Method
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <button
                  onClick={() => setPaymentMethod("upi")}
                  className={`w-full flex items-center cursor-pointer outline-0 gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all duration-200
                    ${paymentMethod === "upi"
                      ? "border-[#2F6B4F] bg-[#E6EEE8]"
                      : "border-gray-200 hover:border-gray-400"}`}
                >
                  <Wallet className="text-[#2F6B4F] w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-gray-800 text-sm sm:text-base">
                    UPI / Wallets
                  </span>
                </button>

                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`w-full flex items-center gap-3 sm:gap-4 cursor-pointer outline-0 p-3 sm:p-4 rounded-xl border transition-all duration-200
                    ${paymentMethod === "card"
                      ? "border-[#2F6B4F] bg-[#E6EEE8]"
                      : "border-gray-200 hover:border-gray-400"}`}
                >
                  <CreditCard className="text-[#2F6B4F] w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-gray-800 text-sm sm:text-base">
                    Credit / Debit Card
                  </span>
                </button>

                <button
                  onClick={() => setPaymentMethod("cod")}
                  className={`w-full flex items-center gap-3 sm:gap-4 cursor-pointer outline-0 p-3 sm:p-4 rounded-xl border transition-all duration-200
                    ${paymentMethod === "cod"
                      ? "border-[#2F6B4F] bg-[#E6EEE8]"
                      : "border-gray-200 hover:border-gray-400"}`}
                >
                  <Truck className="text-[#2F6B4F] w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-gray-800 text-sm sm:text-base">
                    Cash on Delivery
                  </span>
                </button>
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="border-t pt-4 sm:pt-5 md:pt-6 space-y-2 sm:space-y-3 text-sm text-gray-700">
              <div className="flex justify-between text-sm sm:text-base">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm sm:text-base">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>

              <div className="border-t pt-3 sm:pt-4 flex justify-between text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              disabled={!paymentMethod}
              className={`mt-6 sm:mt-8 md:mt-10 w-full  py-3 sm:py-3.5 md:py-4 rounded-xl text-sm sm:text-base font-medium transition-all duration-200
                ${paymentMethod
                  ? "bg-[#2F6B4F] hover:bg-[#24563F] text-white cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            >
              {paymentMethod
                ? "Proceed to Payment"
                : "Select a Payment Method"}
            </button>

            <p className="mt-3 sm:mt-4 text-center text-[10px] sm:text-xs text-gray-400">
              Secure payment gateway will be integrated soon.
            </p>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Checkout;