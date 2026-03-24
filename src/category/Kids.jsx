import React, { useEffect, useState } from 'react'
import { Helmet } from "react-helmet-async";
import kidsSale from '../assets/kidsSale.jpg'
import Navbar from '../components/Navbar'
import Cards from '../components/Cards'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import axios from 'axios';
import Loader from '../components/Loader';
import ErrorState from '../components/ErrorState';

const Kids = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get("https://velnixa-backend.vercel.app/products/kids");
      setProducts(res.data.product);

    } catch (err) {
      console.log(err);

      if (!navigator.onLine) {
        setError("No internet connection 🚫");
      } else {
        setError("Unable to load kids products 😕");
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
        <title>Kids Clothing Collection | Buy Kids Wear Online | Velnixa</title>

        <meta
          name="description"
          content="Shop trendy and comfortable kids clothing at Velnixa."
        />

        <link rel="canonical" href="https://velnixa.vercel.app/kids" />
      </Helmet>

      <Navbar />

      <div className='bg-[#FAF8F5] flex px-4 md:px-10 justify-center py-2'>
        <img
          className='w-full sm:w-[85%] rounded-2xl h-[30vh] sm:h-[70vh] shadow-sm object-cover'
          src={kidsSale}
          alt="Kids fashion sale banner"
        />
        <h1 className="sr-only">Kids Clothing Collection at Velnixa</h1>
      </div>

      <div className="bg-[#FAF8F5] min-h-[60vh] flex items-center justify-center">

        {loading && <Loader text="Loading kids collection..." />}

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
          <div className='w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 
                          gap-x-5 gap-y-5 py-10 px-8 sm:px-10 md:px-16 lg:px-20'>

            {products.map((item) => (
              <Link
                key={`${item._id}`}
                to={`/products/${item._id}`}
              >
                <Cards data={item} />
              </Link>
            ))}

          </div>
        )}

      </div>

      <Footer />
    </>
  )
}

export default Kids;