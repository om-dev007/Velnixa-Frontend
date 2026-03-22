import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";        // ✅ added
import ErrorState from "../components/ErrorState"; // ✅ added

const Cart = () => {

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ✅ added

  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("https://velnixa-backend.onrender.com/cart/get", {
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
          image: item.productId.image,
          price: item.price,
          quantity: item.quantity,
          size: item.size || "M",
        }));

        setCartItems(formattedItems);
      }

    } catch (error) {
      console.log(error);

      if (!navigator.onLine) {
        setError("No internet connection 🚫");
      } else {
        setError("Unable to load cart 😕");
      }

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (productId, size) => {
    setCartItems(prev =>
      prev.filter(item => !(item.id === productId && item.size === size))
    );

    try {
      await fetch(`https://velnixa-backend.onrender.com/cart/delete/${productId}/${size}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateQuantity = async (productId, action, size) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === productId && item.size === size) {
          return {
            ...item,
            quantity:
              action === "increase"
                ? item.quantity + 1
                : item.quantity - 1,
          };
        }
        return item;
      }).filter(item => item.quantity > 0)
    );

    try {
      await fetch("https://velnixa-backend.onrender.com/cart/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, action, size }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // 🔥 LOADING (only replaced UI)
  if (loading) {
    return (
      <>
        <Navbar />
        <Loader text="Loading cart..." />
        <Footer />
      </>
    );
  }

  // 🔥 ERROR (added)
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
        <title>Your Cart | Velnixa</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Navbar />

      <section className="bg-[#FAF8F5] min-h-screen px-4 sm:px-8 md:px-16 py-12">
        <h1 className="text-3xl font-semibold text-center text-[#1F3D2B] mb-10">
          Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-gray-500 mb-6">
              Your cart is currently empty
            </p>
            <Link
              to="/"
              className="inline-block bg-[#2F6B4F] hover:bg-[#24563F] text-white px-6 py-3 rounded-lg"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="bg-white rounded-2xl p-5 flex gap-5 items-center shadow-sm"
                >
                  <Link to={`/products/${item.id}`}>
                    <img
                      src={item.image?.desktop || item.image}
                      alt={item.title}
                      className="w-24 h-28 object-cover rounded-xl"
                    />
                  </Link>

                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Size: <span className="font-medium">{item.size}</span>
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      ${item.price} each
                    </p>

                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={() => updateQuantity(item.id, "decrease", item.size)}
                        disabled={item.quantity === 1}
                        className="w-8 h-8 cursor-pointer flex items-center justify-center border border-[#1F3D2B] rounded-full"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="font-medium">{item.quantity}</span>

                      <button
                        onClick={() => updateQuantity(item.id, "increase", item.size)}
                        disabled={item.quantity === 10}
                        className="w-8 h-8 cursor-pointer flex items-center justify-center border border-[#1F3D2B] rounded-full"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="text-right space-y-4">
                    <p className="font-semibold text-gray-900">
                      ${(item.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => handleRemove(item.id, item.size)}
                      className="text-gray-400 cursor-pointer hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="flex justify-between text-gray-600 mb-3">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600 mb-3">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="border-t pt-4 flex justify-between font-semibold text-gray-900 text-lg">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full cursor-pointer bg-[#2F6B4F] hover:bg-[#24563F] text-white py-3 rounded-xl"
              >
                Proceed to Checkout
              </button>
            </div>

          </div>
        )}
      </section>

      <Footer />
    </>
  );
};

export default Cart;