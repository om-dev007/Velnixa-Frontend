import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowRight, Star, Heart } from "lucide-react";
import Toast from "../components/Toast";
import { Helmet } from "react-helmet-async";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";

const ProductDetail = () => {

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [toast, setToast] = useState(null);

  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {

    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://velnixa-backend.onrender.com/products/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setProduct(data.product);

      } catch (error) {
        console.log(error);

        if (!navigator.onLine) {
          setError("No internet connection 🚫");
        } else {
          setError("Unable to load product 😕");
        }

      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();

  }, [id]);

  const handleAddToCart = async () => {

    if (!selectedSize) {
      setToast({ message: "Please select size ❗", type: "error" });
      return;
    }

    setToast({ message: "Adding to cart...", type: "success" });

    try {

      const res = await fetch("https://velnixa-backend.onrender.com/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: product._id,
          quantity,
          size: selectedSize,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setToast({ message: "Added to cart ✅", type: "success" });
      setQuantity(1);
      setSelectedSize(null);

    } catch (error) {
      setToast({ message: error.message || "Error ❌", type: "error" });
    } finally {
      setTimeout(() => setToast(null), 1500);
    }
  };

  const handleToggleWishlist = async () => {

    if (!product?._id) return;

    setWishlistLoading(true);

    try {

      const res = await fetch("https://velnixa-backend.onrender.com/wishlist/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: product._id
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setToast({
        message: data.message,
        type: "success",
      });

    } catch (error) {
      setToast({
        message: error.message || "Wishlist error ❌",
        type: "error",
      });
    } finally {
      setWishlistLoading(false);
      setTimeout(() => setToast(null), 1500);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader text="Loading product..." />
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <ErrorState 
          message={error} 
          onRetry={() => window.location.reload()} 
        />
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="py-20 text-center text-gray-600">
          Product not found 😶
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${product.name} | Buy Online at Velnixa`}</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <Navbar />

      <div className="bg-[#FAF8F5] py-4 text-sm text-gray-500 px-6 md:px-16">
        <div className="flex text-[10px] sm:text-sm items-center gap-1">
          Home <ArrowRight className="w-2" />
          Shop <ArrowRight className="w-2" />
          {product.category} <ArrowRight className="w-2" />
          <span className="text-[#1F3D2B] font-medium">
            {product.name}
          </span>
        </div>
      </div>

      <section className="bg-[#FAF8F5] px-5 sm:px-10 md:px-16 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm p-6 md:p-10
          grid grid-cols-1 lg:grid-cols-[90px_1.3fr_1.7fr] gap-6">

          <div className="flex lg:flex-col gap-3 order-2 lg:order-1 justify-center lg:justify-start">
            {[1, 2, 3].map((_, i) => (
              <img
                key={i}
                src={product.image}
                alt=""
                className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg object-cover cursor-pointer"
              />
            ))}
          </div>

          <div className="flex order-1 lg:order-2 justify-center items-center">
            <picture>
              <source media="(min-width: 768px)" srcSet={product.image} />
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-w-65 sm:max-w-75 md:max-w-[320px] lg:max-w-95 object-cover rounded-xl"
              />
            </picture>
          </div>

          <div className="space-y-5 order-3 text-center lg:text-start">

            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
              {product.name}
            </h1>

            <div className="flex gap-2 items-center justify-center lg:justify-start">
              <Star className="w-4 text-gray-500" />
              <span className="text-sm text-gray-600 font-medium">
                {product.rating}
              </span>
            </div>

            <span className="text-[#1F3D2B] text-2xl font-bold">
              ${product.price}
            </span>

            <p className="text-gray-600 text-sm">
              {product.description}
            </p>

            <div>
              <p className="font-semibold mb-2">Select Size</p>
              <div className="flex gap-3 flex-wrap justify-center lg:justify-start">
                {["S","M","L","XL","XXL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 cursor-pointer py-2 rounded-lg border ${
                      selectedSize === size
                        ? "border-[#1F3D2B] bg-[#E6EEE8]"
                        : "border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 justify-center lg:justify-start">
              <button
                disabled={!selectedSize}
                onClick={handleAddToCart}
                className={`px-6 py-3 rounded-lg cursor-pointer ${
                  selectedSize
                    ? "bg-[#2F6B4F] text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                Add to Cart
              </button>

              <button
                disabled={wishlistLoading}
                onClick={handleToggleWishlist}
                className="px-4 py-3 cursor-pointer bg-[#2F6B4F] text-white rounded-lg"
              >
                <Heart />
              </button>
            </div>

          </div>

        </div>
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

export default ProductDetail;