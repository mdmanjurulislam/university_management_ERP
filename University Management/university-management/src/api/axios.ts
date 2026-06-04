import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`Request [${config.method?.toUpperCase()}]: ${config.url}`, {
        hasToken: !!token,
        headers: config.headers
      });
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    
    // If error is 401 and we haven't retried yet
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = sessionStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          // Attempt to refresh the token
          // Note: Using a direct axios call to avoid the interceptors on the refresh request
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`, {
            refreshToken
          });
          
          if (response.data.code === 200) {
            const { accessToken, refreshToken: newRefreshToken } = response.data.response;
            
            sessionStorage.setItem('token', accessToken);
            sessionStorage.setItem('refreshToken', newRefreshToken);
            
            // Update original request header and retry
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, clear everything and redirect
          console.error('Token refresh failed:', refreshError);
        }
      }

      // If we reach here, it means refresh failed or was not possible
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('user');
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
