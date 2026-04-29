import Cards from '../components/Cards'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getPopularProducts } from '../api/product.api'
import Loader from '../components/Loader'
import ErrorState from '../components/ErrorState'

const NewCollection = () => {

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await getPopularProducts()
      const {data} = res.data
      setProducts(data)

    } catch (err) {
      console.log(err)

      if (!navigator.onLine) {
        setError("No internet connection 🚫")
      } else {
        setError("Unable to load products 😕")
      }

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  if (loading) return <Loader text="Loading offers..." />

  if (error) {
    return (
      <ErrorState 
        message={error} 
        onRetry={fetchProducts} 
      />
    )
  }

  if (products.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FAF8F5]">
        <p className="text-gray-600 text-lg">
          No products found 😶
        </p>
      </div>
    )
  }

  return (
    <div className='pt-10 bg-[#FAF8F5] '>
      <div className='text-center'>
        <h1 className='text-3xl text-gray-800'>NEW OFFERS</h1>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-5 py-10 px-8 sm:px-10 md:px-16 lg:px-20'>
        {
          products.map((items) => (
            <Link key={`${items._id}`} to={`/products/${items._id}`}>
              <Cards data={items} />
            </Link>
          ))
        }
      </div>
    </div>
  )
}

export default NewCollection