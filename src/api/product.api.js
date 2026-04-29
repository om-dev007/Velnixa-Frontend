import { API } from "./client";

const extractArray = (res) => {
  const data = res?.data?.data;
  return Array.isArray(data) ? data : [];
};

const extractObject = (res) => {
  return res?.data?.data ?? null;
};

export const getProductById = async (id) =>
  extractObject(await API.get(`/products/${id}`));

export const getAllProducts = async () =>
  extractArray(await API.get("/products"));

export const getPopularProducts = async () =>
  extractArray(await API.get("/products/popular"));

export const getDataProducts = async () =>
  extractArray(await API.get("/products/data"));

export const getMenProducts = async () =>
  extractArray(await API.get("/products/men"));

export const getWomenProducts = async () =>
  extractArray(await API.get("/products/women"));

export const getKidsProducts = async () =>
  extractArray(await API.get("/products/kids"));

export const getNewArrivals = async () =>
  extractArray(await API.get("/products/new-arrivals"));