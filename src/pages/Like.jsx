import { useWishlist } from "../context/useWishlist";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
// import { useCart } from "../context/useCart";
import Toast from "../components/Toast";
import { useState } from "react";

const Like = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const [toast, setToast] = useState(null);
  // const { addToCart } = useCart()

  return (
    <>
      <Navbar />

      <section className="bg-[#FAF8F5] min-h-screen px-6 md:px-16 py-12">
        <h1 className="text-3xl font-semibold text-center mb-10">
          Your Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <p className="text-center text-gray-500">No liked products yet</p>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {wishlist.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition
             flex gap-4 items-center"
              >
                <Link to={`/product/${item.id}`} >
                  <img
                  src={item.image?.desktop || item.image}
                  alt={item.title}
                  className="w-24 h-28 rounded-xl object-cover"
                />
                </Link>

                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold text-gray-900 leading-tight">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Size: <span className="font-medium">{item.size}</span>
                  </p>

                  <p className="text-base font-semibold text-[#1F3D2B]">
                    ${item.price}
                  </p>

                  <div className="flex gap-4 mt-2">
                    {/* <button
                      onClick={() => {
                        addToCart(item, 1);

                        setToast({
                          message: "Added to cart successfully",
                          type: "success",
                        });

                        setTimeout(() => {
                          setToast(null);
                        }, 2000);
                      }}

                      className="text-sm px-3 py-1.5 outline-0 rounded-lg
                   bg-[#2F6B4F] hover:bg-[#24563F] cursor-pointer
                   text-white transition"
                    >
                      Add to Cart
                    </button> */}

                    <button
                      onClick={() => removeFromWishlist(item.id, item.size)}
                      className="text-sm cursor-pointer text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

            ))}
          </div>
        )}
      </section>
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-toast-in ">
          <Toast message={toast.message} type={toast.type} />
        </div>
      )}
      <Footer />
    </>
  );
};

export default Like;
