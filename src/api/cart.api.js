import { API } from "./client";

export const addToCart = (data) =>
  API.post("/cart/add", data);

export const getCart = () =>
  API.get("/cart/get");

export const updateCart = (data) =>
  API.patch("/cart/update", data);

export const deleteCartItem = (productId, size) =>
  API.delete(`/cart/delete/${productId}/${size}`);