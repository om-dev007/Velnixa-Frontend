import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { updateProduct, getAllProducts } from "../../api/admin.api";
import Toast from "../../components/Toast";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Helmet } from "react-helmet-async";
import { FiArrowLeft, FiSave } from "react-icons/fi";

const EditProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "MEN",
    image: "",
    rating: "",
    section: "data",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getAllProducts();
        if (res.success) {
          const product = res.data.find(p => p._id === id);
          if (product) {
            setFormData({
              name: product.name || "",
              description: product.description || "",
              price: product.price || "",
              category: product.category || "MEN",
              image: product.image || "",
              rating: product.rating || "",
              section: product.section || "data",
            });
          } else {
            setToast({ message: "Product not found", type: "error" });
            setTimeout(() => navigate("/admin/dashboard"), 1500);
          }
        }
      } catch {
        setToast({ message: "Error fetching product", type: "error" });
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price || !formData.image || !formData.rating) {
      setToast({ message: "Please fill all required fields", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const res = await updateProduct(id, {
        ...formData,
        price: Number(formData.price),
        rating: Number(formData.rating),
      });
      
      if (res.success) {
        setToast({ message: "Product updated successfully!", type: "success" });
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1500);
      } else {
        setToast({ message: res.message || "Failed to update product", type: "error" });
      }
    } catch {
      setToast({ message: "Error updating product", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "admin") {
    navigate("/");
    return null;
  }

  if (fetching) {
    return (
      <>
        <Navbar />
        <div className="h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#2F6B4F] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Product | Admin | Velnixa</title>
      </Helmet>

      <Navbar />

      <section className="min-h-screen bg-[#FAF8F5] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-6 sm:py-8 md:py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="p-2 rounded-xl bg-white shadow-sm hover:shadow-md transition-all"
            >
              <FiArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#1F3D2B]">
              Edit Product
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#2F6B4F] focus:ring-2 focus:ring-[#2F6B4F] focus:ring-opacity-20 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#2F6B4F] focus:ring-2 focus:ring-[#2F6B4F] focus:ring-opacity-20 outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price * ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#2F6B4F] focus:ring-2 focus:ring-[#2F6B4F] focus:ring-opacity-20 outline-none transition-all"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating * (1-5)
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#2F6B4F] focus:ring-2 focus:ring-[#2F6B4F] focus:ring-opacity-20 outline-none transition-all"
                    step="0.1"
                    min="0"
                    max="5"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL *
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#2F6B4F] focus:ring-2 focus:ring-[#2F6B4F] focus:ring-opacity-20 outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#2F6B4F] focus:ring-2 focus:ring-[#2F6B4F] focus:ring-opacity-20 outline-none transition-all"
                    required
                  >
                    <option value="MEN">MEN</option>
                    <option value="WOMEN">WOMEN</option>
                    <option value="KIDS">KIDS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section *
                  </label>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#2F6B4F] focus:ring-2 focus:ring-[#2F6B4F] focus:ring-opacity-20 outline-none transition-all"
                    required
                  >
                    <option value="data">Data</option>
                    <option value="popular">Popular</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                    <option value="newArrivals">New Arrivals</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#2F6B4F] hover:bg-[#24563F] text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FiSave size={18} />
                  {loading ? "Updating..." : "Update Product"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/admin/dashboard")}
                  className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {toast && (
        <div className="fixed top-5 right-5 z-50">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      <Footer />
    </>
  );
};

export default EditProduct;