import { API } from "./client";

const handleResponse = (res) => ({
  success: res?.data?.success ?? true,
  data: res?.data?.data ?? null,
  message: res?.data?.message ?? "Success",
});

const handleError = (error) => ({
  success: false,
  data: null,
  message:
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong",
});

export const toggleWishlist = async (productId) => {
  try {
    const res = await API.post("/wishlist/toggle", { productId });
    return handleResponse(res);
  } catch (error) {
    return handleError(error);
  }
};

export const getWishlist = async () => {
  try {
    const res = await API.get("/wishlist");

    const formatted = handleResponse(res);

    if (!formatted.data || !Array.isArray(formatted.data.items)) {
      formatted.data = { items: [] };
    }

    return formatted;

  } catch (error) {
    return handleError(error);
  }
};

export const removeFromWish = async (productId) => {
  try {
    const res = await API.delete(`/wishlist/${productId}`);
    return handleResponse(res);
  } catch (error) {
    return handleError(error);
  }
};