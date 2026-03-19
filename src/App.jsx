import Home from "./pages/Home"
import { Route, Routes } from "react-router-dom"
import ProductDetail from "./productDetail/ProductDetail"
import NotFound from './pages/NotFound'
import Men from "./category/Men"
import Women from "./category/Women"
import Kids from "./category/Kids"
import About from './pages/About'
import Help from "./pages/Help"
import Offices from "./pages/Offices"
import ScrollToTop from "./components/ScrollToTop"
import Login from "./LoginSignUp/Login"
import Register from "./LoginSignUp/Register"
import Cart from "./pages/Cart"
import NewArrival from "./pages/NewArrival"
import Like from "./pages/Like"
import Checkout from "./pages/Checkout"
import Contact from "./pages/Contact"
import Dashboard from "./pages/Dashboard"

const isMaintenance = import.meta.env.VITE_MAINTENANCE === "true";


const App = () => {

  if (isMaintenance) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white text-center px-4">
        <h1 className="text-4xl font-bold">🚧 Site Under Development</h1>
        <p className="mt-3 text-gray-400">
          We are working on the store. Please check back soon.
        </p>
      </div>
    );
  }


  return (
    <div className='bg-white min-h-screen text-black'>
      <ScrollToTop />
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/user" element={<Dashboard/>} />
        <Route path="/about" element={<About />} />
        <Route path="/mens" element={<Men />} />
        <Route path="/womens" element={<Women />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/help" element={<Help />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/like" element={<Like />} />
        <Route path="/offices" element={<Offices />} />
        <Route path="/new-arrivals" element={<NewArrival/>} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<Contact/>} />
      </Routes>
    </div>
  )
}

export default App