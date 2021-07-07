import axios from 'axios';
import { setupCache } from 'axios-cache-adapter'

const cache = setupCache({
  maxAge: 2 * 60 * 1000
})

const instance = axios.create({
  baseURL: process.env.API_URL ?? 'http://localhost:8008/api',
  adapter: cache.adapter
});

export default instance;