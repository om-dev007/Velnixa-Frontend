import React, { useState, useEffect } from 'react'
import { Helmet } from "react-helmet-async";
import Navbar from '../components/Navbar'
import creative from '../assets/summer-fashion-sale-banner-design-template-62077c541db2b288dbccd6d9d1c9af3d_screen.jpg'
import Cards from '../components/Cards'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader';
import ErrorState from '../components/ErrorState';
import { getWomenProducts } from '../api/product.api';

const Women = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getWomenProducts();
      const {data} = res.data
      setProducts(data);

    } catch (err) {
      console.log(err);

      if (!navigator.onLine) {
        setError("No internet connection 🚫");
      } else {
        setError("Unable to load women's products 😕");
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
        <title>Women Clothing Collection | Trendy Women Wear | Velnixa</title>

        <meta
          name="description"
          content="Shop trendy and premium women clothing at Velnixa."
        />

        <link rel="canonical" href="https://velnixa.vercel.app/womens" />
      </Helmet>

      <Navbar />

      <div className='bg-[#FAF8F5] flex justify-center py-2 px-4 md:px-10'>
        <img
          className='w-full sm:w-[85%] rounded-2xl h-[30vh] sm:h-[70vh] shadow-sm object-cover'
          src={creative}
          alt="Women fashion collection banner"
        />
      </div>

      <h1 className="sr-only">Women Clothing Collection at Velnixa</h1>

      <div className="bg-[#FAF8F5] min-h-[60vh] flex items-center justify-center">

        {loading && <Loader text="Loading women's collection..." />}

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

export default Women;