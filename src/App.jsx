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
import UserDashboard from "./pages/UserDashboard"
import ForgotPassword from "./components/ForgotPassword"
import ProfileSettings from "./pages/ProfileSettings"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"
import AddProduct from "./pages/admin/AddProduct"
import AdminDashboard from "./pages/admin/AdminDashboard"
import EditProduct from "./pages/admin/EditProduct"

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
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/mens" element={<Men />} />
        <Route path="/womens" element={<Women />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/help" element={<Help />} />
        <Route path="/offices" element={<Offices />} />
        <Route path="/new-arrivals" element={<NewArrival />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products/:id" element={<ProductDetail />} />

        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/like"
          element={
            <ProtectedRoute>
              <Like />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products/new"
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products/edit/:id"
          element={
            <AdminRoute>
              <EditProduct />
            </AdminRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App