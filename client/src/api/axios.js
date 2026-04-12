import axios from "axios";

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "/api",
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

API.interceptors.response.use(
    (res) => res,
    (err) => {
        // Enhance error message for network/CORS failures
        if (!err.response) {
            err.message = "Cannot connect to server. Please check your connection.";
        }
        return Promise.reject(err);
    }
);

export default API;
