import axios from 'axios';

const api = axios.create({
  baseURL: 'https://laparrilla-r0dn.onrender.com',
});

export default api;
