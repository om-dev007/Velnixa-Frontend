import { API } from "./client";

export const toggleWishlist = (productId) =>
  API.post("/wishlist/toggle", { productId });

export const getWishlist = () =>
  API.get("/wishlist");

export const removeFromWish = (productId) =>
  API.delete(`/wishlist/${productId}`);