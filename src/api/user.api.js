import { API } from "./client";

export const getProfile = () =>
  API.get("/user");

export const updateUser = (id, data) =>
  API.post(`/user/update/${id}`, data);

export const deleteUser = (id) =>
  API.delete(`/user/delete/${id}`); 