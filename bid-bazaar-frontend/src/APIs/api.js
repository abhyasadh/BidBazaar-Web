import axios from "axios";
import { useCsrf } from "../contexts/CsrfContext";
import { toast } from "react-toastify";
import { useCallback } from "react";

const Api = axios.create({
  baseURL: "http://localhost:5000/",
  withCredentials: true,
});

const handleApiError = (error) => {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        toast.error("Bad Request: Please check your input.");
        break;
      case 401:
        toast.error("Unauthorized: Please log in again.");
        // Optionally trigger logout or redirect to login
        break;
      case 403:
        toast.error("Forbidden: You don't have permission.");
        break;
      case 404:
        toast.error("Not Found: The requested resource doesn't exist.");
        break;
      case 429:
        toast.error("Too Many Requests: Please try again later.");
        break;
      case 500:
        toast.error("Server Error: Something went wrong on our end.");
        break;
      default:
        toast.error(data?.message || "An unexpected error occurred.");
    }
  } else if (error.request) {
    toast.error("No response from server. Please check your connection.");
  } else {
    toast.error("Error setting up the request.");
  }
};

Api.interceptors.response.use(
  response => response,
  error => handleApiError(error)
);

export const sessionApi = () => Api.get('/api/user/session');
export const getCsrfTokenApi = () => Api.get('/api/csrf-token');

export const useProtectedApi = () => {
  const { csrfToken } = useCsrf();

  const protectedGet = useCallback(async (url, config = {}) => {
    return await Api.get(url, {
      ...config,
      headers: {
        ...config.headers,
        'X-CSRF-Token': csrfToken,
      },
    });
  }, [csrfToken]);

  const protectedPost = useCallback(async (url, data, config = {}) => {
    return await Api.post(url, data, {
      ...config,
      headers: {
        ...config.headers,
        'X-CSRF-Token': csrfToken,
      },
    });
  }, [csrfToken]);

  const protectedPut = useCallback(async (url, data, config = {}) => {
    return await Api.put(url, data, {
      ...config,
      headers: {
        ...config.headers,
        'X-CSRF-Token': csrfToken,
      },
    });
  }, [csrfToken]);

  const protectedDelete = useCallback(async (url, config = {}) => {
    return await Api.delete(url, {
      ...config,
      headers: {
        ...config.headers,
        'X-CSRF-Token': csrfToken,
      },
    });
  }, [csrfToken]);

  return {
    protectedGet,
    protectedPost,
    protectedPut,
    protectedDelete,
  };
};

export const apis = {
  login: '/api/user/login',
  signup: '/api/user/register',
  sendOtp: '/api/user/send-otp',
  verifyOtp: '/api/user/verify-otp',
  resetPassword: '/api/user/update-password',
  logout: '/api/user/logout',

  productPost: '/api/product/new',
  getProducts: '/api/product/all',
  getProductById: '/api/product/get',
  getFilteredProducts: '/api/product/filter',
  save: '/api/product/save',
  getSaved: '/api/product/get-saved',

  getCategories: '/api/category/',
  getSpecifications: '/api/category/specifications',

  contact: '/api/contact',
  report: '/api/report',
}