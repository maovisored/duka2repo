// api/products.js
import axios from "axios";

<<<<<<< HEAD
const BASE_URL = "https://duka2repo-production.up.railway.app/api/full";
=======
const BASE_URL = "https://iwioeecgwuvibgrjbrvg.supabase.co/api/full";
>>>>>>> 04940bc27950ee59effc147b6ddc3e63bd3db84e

// Products
export const fetchProducts = () => axios.get(`${BASE_URL}/`);
export const createProduct = (data) => axios.post(`${BASE_URL}/`, data);
export const updateProduct = (id, data, isMultipart = false) => {
  if (isMultipart) {
    return axios.put(`${BASE_URL}/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
  }
  return axios.put(`${BASE_URL}/${id}`, data);
};
export const deleteProduct = (id) => axios.delete(`${BASE_URL}/${id}`);

// Variations
export const addVariation = (data) => axios.post(`${BASE_URL}/variation`, data);
export const updateVariation = (id, data) => axios.put(`${BASE_URL}/variation/${id}`, data);
export const deleteVariation = (id) => axios.delete(`${BASE_URL}/variation/${id}`);

// Weights
export const addWeight = (data) => axios.post(`${BASE_URL}/weight`, data);
export const updateWeight = (id, data) => axios.put(`${BASE_URL}/weight/${id}`, data);
export const deleteWeight = (id) => axios.delete(`${BASE_URL}/weight/${id}`);