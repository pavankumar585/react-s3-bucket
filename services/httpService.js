import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const http = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};

export default http;
