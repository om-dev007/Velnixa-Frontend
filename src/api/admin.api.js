import { API } from "./client";

// Product APIs
export const createProduct = (data) =>
  API.post("/admin/product/create", data);

export const updateProduct = (id, data) =>
  API.put(`/admin/product/${id}`, data);

export const deleteProduct = (id) =>
  API.delete(`/admin/product/${id}`);

export const getAllProducts = () =>
  API.get("/admin/products");

// User APIs
export const getAllUsers = () =>
  API.get("/admin/users");

export const getOneUser = (id) =>
  API.get(`/admin/user/${id}`);

export const deleteOneUser = (id) =>
  API.delete(`/admin/user/${id}`);