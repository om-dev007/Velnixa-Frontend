import { Helmet } from "react-helmet-async";
import Navbar from '../components/Navbar'
import menHero from '../assets/menHero.jpg'
import Cards from '../components/Cards'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import ErrorState from '../components/ErrorState';

const Men = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get("https://velnixa-backend.onrender.com/products/men");
      setProducts(res.data.product);

    } catch (err) {
      console.log(err);

      if (!navigator.onLine) {
        setError("No internet connection 🚫");
      } else {
        setError("Unable to load men's products 😕");
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
        <title>Men Clothing Collection | Oversized T-Shirts for Men | Velnixa</title>

        <meta
          name="description"
          content="Shop premium men clothing at Velnixa."
        />

        <link rel="canonical" href="https://velnixa.vercel.app/mens" />
      </Helmet>

      <Navbar />

      <div className="bg-[#FAF8F5] py-2 flex justify-center px-4 md:px-10">
        <img
          className="w-full sm:w-[85%] rounded-2xl h-[30vh] sm:h-[70vh] shadow-sm object-cover"
          src={menHero}
          alt="Men fashion collection"
        />
      </div>

      <div className="bg-[#FAF8F5] min-h-[60vh] flex items-center justify-center">

        {loading && <Loader text="Loading men's collection..." />}

        {!loading && error && (
          <ErrorState 
            message={error} 
            onRetry={fetchProducts} 
          />
        )}

        {!loading && !error && products.length === 0 && (
          <p className="text-gray-600 text-lg">
            No products found 😶
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 
                          gap-x-5 gap-y-6 py-10 px-6 sm:px-10 md:px-16 lg:px-20">

            <h1 className="sr-only">Men Clothing Collection at Velnixa</h1>

            {products.map((items) => (
              <Link
                to={`/products/${items._id}`}
                key={`${items._id}`}
              >
                <Cards data={items} />
              </Link>
            ))}

          </div>
        )}

      </div>

      <Footer />
    </>
  )
}

export default Men;