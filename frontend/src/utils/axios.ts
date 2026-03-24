import axios from "axios";

import toast from "react-hot-toast";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const message = error.response.data?.message || "";
      
      // If it's a suspension/ban message, show it
      if (message.toLowerCase().includes("suspended") || 
          message.toLowerCase().includes("banned") || 
          message.toLowerCase().includes("support")) {
        toast.error(message, { id: "auth-error" });
      }

      // Clear local user state
      localStorage.removeItem("user");
      
      // Redirect to login if not already there
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
