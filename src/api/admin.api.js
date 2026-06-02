import { API } from "./client";

const extractResponse = (res) => {
  return {
    success: res?.data?.success ?? true,
    data: res?.data?.data ?? null,
    message: res?.data?.message ?? "Success",
  };
};

// Product APIs
export const createProduct = async (data) => {
  const res = await API.post("/admin/product/create", data);
  return extractResponse(res);
};

export const updateProduct = async (id, data) => {
  const res = await API.put(`/admin/product/${id}`, data);
  return extractResponse(res);
};

export const deleteProduct = async (id) => {
  const res = await API.delete(`/admin/product/${id}`);
  return extractResponse(res);
};

export const getAllProducts = async () => {
  const res = await API.get("/admin/products");
  return extractResponse(res);
};

// User APIs
export const getAllUsers = async () => {
  const res = await API.get("/admin/users");
  return extractResponse(res);
};

export const getOneUser = async (id) => {
  const res = await API.get(`/admin/user/${id}`);
  return extractResponse(res);
};

export const deleteOneUser = async (id) => {
  const res = await API.delete(`/admin/user/${id}`);
  return extractResponse(res);
};