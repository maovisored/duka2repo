import axios from "axios";

const api = axios.create({
  baseURL: "https://iwioeecgwuvibgrjbrvg.supabase.co/api",
});

// ✅ Export this properly
export const getProducts = async () => {
  const res = await api.get("/full");
  return res.data;
};

export default api;