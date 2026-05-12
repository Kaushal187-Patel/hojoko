import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getErrorMessage = (error) => {
  const data = error.response?.data;

  if (typeof data?.message === 'string') {
    return data.message;
  }

  if (typeof data === 'string') {
    return data;
  }

  return error.message || 'Something went wrong';
};

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = getErrorMessage(error);
    const wrappedError = new Error(message);
    wrappedError.status = error.response?.status;
    wrappedError.isRateLimited = error.response?.status === 429;
    return Promise.reject(wrappedError);
  }
);

export default api;
