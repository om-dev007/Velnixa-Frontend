import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CreditCard, Wallet, Truck } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";

const Checkout = () => {

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("");

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:5000/cart/get", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      if (data.success) {
        const formattedItems = data.cart.items.map(item => ({
          id: item.productId._id,
          title: item.productId.name,
          price: item.price,
          quantity: item.quantity,
        }));

        setCartItems(formattedItems);
      }

    } catch (error) {
      console.log(error);

      if (!navigator.onLine) {
        setError("No internet connection 🚫");
      } else {
        setError("Unable to load checkout 😕");
      }

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader text="Loading checkout..." />
        <Footer />
      </>
    );
  }

  if (error) {
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
        <title>Checkout | Secure Payment | Velnixa</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Navbar />

      <section className="min-h-screen bg-[#FAF8F5] px-4 sm:px-8 md:px-16 py-12">
        <div className="max-w-4xl mx-auto">

          <h1 className="text-3xl md:text-4xl font-semibold text-[#1F3D2B] text-center mb-12">
            Checkout
          </h1>

          <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-10">

            <div className="mb-10">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-sm text-gray-700"
                  >
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-gray-500">
                        Qty {item.quantity}
                      </p>
                    </div>

                    <p className="font-medium">
                      ${item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Payment Method
              </h2>

              <div className="space-y-4">

                <button
                  onClick={() => setPaymentMethod("upi")}
                  className={`w-full flex items-center cursor-pointer outline-0 gap-4 p-4 rounded-xl border transition
                    ${paymentMethod === "upi"
                      ? "border-[#2F6B4F] bg-[#E6EEE8]"
                      : "border-gray-200 hover:border-gray-400"}`}
                >
                  <Wallet className="text-[#2F6B4F]" />
                  <span className="font-medium text-gray-800">
                    UPI / Wallets
                  </span>
                </button>

                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`w-full flex items-center gap-4 cursor-pointer outline-0 p-4 rounded-xl border transition
                    ${paymentMethod === "card"
                      ? "border-[#2F6B4F] bg-[#E6EEE8]"
                      : "border-gray-200 hover:border-gray-400"}`}
                >
                  <CreditCard className="text-[#2F6B4F]" />
                  <span className="font-medium text-gray-800">
                    Credit / Debit Card
                  </span>
                </button>

                <button
                  onClick={() => setPaymentMethod("cod")}
                  className={`w-full flex items-center gap-4 cursor-pointer outline-0 p-4 rounded-xl border transition
                    ${paymentMethod === "cod"
                      ? "border-[#2F6B4F] bg-[#E6EEE8]"
                      : "border-gray-200 hover:border-gray-400"}`}
                >
                  <Truck className="text-[#2F6B4F]" />
                  <span className="font-medium text-gray-800">
                    Cash on Delivery
                  </span>
                </button>

              </div>
            </div>

            <div className="border-t pt-6 space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>

              <div className="border-t pt-4 flex justify-between text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span>${subtotal}</span>
              </div>
            </div>

            <button
              disabled={!paymentMethod}
              className={`mt-10 w-full py-4 rounded-xl text-sm font-medium transition
                ${paymentMethod
                  ? "bg-[#2F6B4F] hover:bg-[#24563F] text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            >
              {paymentMethod
                ? "Proceed to Payment"
                : "Select a Payment Method"}
            </button>

            <p className="mt-4 text-center text-xs text-gray-400">
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