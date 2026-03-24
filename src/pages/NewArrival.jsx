import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Cards from "../components/Cards";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";

const NewArrival = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        "https://velnixa-backend.vercel.app/products/new-arrivals"
      );

      setProducts(res.data.products);

    } catch (err) {
      console.log(err);

      if (!navigator.onLine) {
        setError("No internet connection 🚫");
      } else {
        setError("Unable to load new arrivals 😕");
      }

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <Helmet>
        <title>New Arrivals | Latest Fashion Collection | Velnixa</title>
        <meta
          name="description"
          content="Explore the latest fashion arrivals at Velnixa."
        />
      </Helmet>

      <Navbar />

      {loading && <Loader text="Loading new arrivals..." />}

      {!loading && error && (
        <ErrorState 
          message={error} 
          onRetry={fetchProducts} 
        />
      )}

      {!loading && !error && products.length === 0 && (
        <div className="h-[60vh] flex items-center justify-center bg-[#FAF8F5]">
          <p className="text-gray-600 text-lg">
            No products found 😶
          </p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <section className="bg-[#FAF8F5] px-5 sm:px-10 md:px-16 py-10 sm:py-14">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1F3D2B]">
              New Arrivals
            </h1>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">
              Fresh styles just landed at Velnixa
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {products.map((item) => (
              <Link key={`${item._id}`} to={`/products/${item._id}`}>
                <Cards data={item} />
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </>
  );
};

export default NewArrival;