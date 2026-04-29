import { API } from "./client";

export const createProduct = (data) =>
  API.post("/admin/create-product", data);