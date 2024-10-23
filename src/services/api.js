import axios from 'axios';

const api = axios.create({
  baseURL: 'sql5.freesqldatabase.com:3306',
});

export default api;
