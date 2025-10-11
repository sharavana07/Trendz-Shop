
import axios from "axios";

export const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export const getProducts = async () => {
  const res = await API.get("/products");
  return res.data;
};

export const createProduct = async (product) => {
  const res = await API.post("/products/", product);
  return res.data;
};
