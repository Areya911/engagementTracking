import axios from "axios";

// In production the React app is served from the same Express server,
// so a relative "/api" path works without CORS issues.
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '/api',
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;
