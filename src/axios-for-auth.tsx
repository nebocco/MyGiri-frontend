import axios from 'axios';
import { setupCache } from 'axios-cache-adapter'

const cache = setupCache({
  maxAge: 5 * 60 * 1000
})

const instance = axios.create({
  baseURL: 'http://localhost:8008/api',
  adapter: cache.adapter
});

export default instance;