import axios from 'axios'
import { API_URL } from './server'

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default axiosInstance
