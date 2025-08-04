import axios from 'axios';
import { BASE_URL } from '../config';

const login = async (email, password) => {
  const response = await axios.post(`${BASE_URL}/login`, { email, password });
  return response.data;
};
const signup = async (name, email, password) => {
  const response = await axios.post(`${BASE_URL}/signup`, { name, email, password });
  return response.data;
};

export default { login, signup };
