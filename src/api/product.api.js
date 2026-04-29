import { API } from "./client";

const extractData = (res) => {
  const data = res?.data?.data;
  return Array.isArray(data) ? data : [];
};

export const getProductById = async (id) =>
  extractData(await API.get(`/products/${id}`))

export const getAllProducts = async () =>
  extractData(await API.get("/products"));

export const getPopularProducts = async () =>
  extractData(await API.get("/products/popular"));

export const getDataProducts = async () =>
  extractData(await API.get("/products/data"));

export const getMenProducts = async () =>
  extractData(await API.get("/products/men"));

export const getWomenProducts = async () =>
  extractData(await API.get("/products/women"));

export const getKidsProducts = async () =>
  extractData(await API.get("/products/kids"));

export const getNewArrivals = async () =>
  extractData(await API.get("/products/new-arrivals"));