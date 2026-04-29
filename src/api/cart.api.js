import { API } from "./client";

const handleResponse = (res) => ({
  success: res?.data?.success ?? true,
  data: res?.data?.data ?? null,
  message: res?.data?.message ?? "Success"
});

const handleError = (error) => ({
  success: false,
  data: null,
  message:
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong"
});

export const addToCart = async (data) => {
  try {
    const res = await API.post("/cart/add", data);
    return handleResponse(res);
  } catch (error) {
    return handleError(error);
  }
};

export const getCart = async () => {
  try {
    const res = await API.get("/cart/get");

    const formatted = handleResponse(res);

    if (!formatted.data || !Array.isArray(formatted.data.items)) {
      formatted.data = { items: [] };
    }

    return formatted;

  } catch (error) {
    return handleError(error);
  }
};

export const updateCart = async (data) => {
  try {
    const res = await API.patch("/cart/update", data);
    return handleResponse(res);
  } catch (error) {
    return handleError(error);
  }
};

export const deleteCartItem = async (productId, size) => {
  try {
    const res = await API.delete(`/cart/delete/${productId}/${size}`);
    return handleResponse(res);
  } catch (error) {
    return handleError(error);
  }
};