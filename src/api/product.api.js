import { API } from "./client";

export const getAllProducts = () => API.get("/products");

export const getProductById = (id) =>
  API.get(`/products/${id}`);

export const getPopularProducts = () =>
  API.get("/products/popular");

export const getDataProducts = () =>
  API.get("/products/data")

export const getMenProducts = () =>
  API.get("/products/men");

export const getWomenProducts = () =>
  API.get("/products/women");

export const getKidsProducts = () =>
  API.get("/products/kids");

export const getNewArrivals = () =>
  API.get("/products/new-arrivals");

export const filterProducts = (category) =>
  API.get(`/products/filter?category=${category}`);