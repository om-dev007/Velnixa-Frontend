import { useEffect, useState } from "react";
import Cards from "../components/Cards";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";

const Popular = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await axios.get("https://velnixa-backend.vercel.app/products/data");
            setProducts(res.data.product);

        } catch (err) {
            console.log(err);

            if (!navigator.onLine) {
                setError("No internet connection 🚫");
            } else {
                setError("Unable to load products 😕");
            }

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) return <Loader text="Loading products..." />;

    if (error) {
        return (
            <ErrorState 
                message={error} 
                onRetry={fetchProducts} 
            />
        );
    }

    if (products.length === 0) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#F5F1EB]">
                <p className="text-gray-600 text-lg">
                    No products found 😶
                </p>
            </div>
        );
    }

    return (
        <div className="py-10 px-5 sm:px-10 bg-[#F5F1EB] ">
            <div className=" text-center">
                <h1 className="text-3xl text-gray-800">TRENDING NOW</h1>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-5 py-10 px-8 sm:px-10 md:px-16 lg:px-20">
                {products.map((item) => (
                    <Link key={`${item._id}`} to={`/products/${item._id}`}>
                        <Cards data={item} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Popular;