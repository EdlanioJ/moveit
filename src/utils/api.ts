import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: true,
});

export default api;
