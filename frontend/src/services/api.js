
import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
        "Content-Type": "application/json"
    }
});

export const submitAssetRequest = async (data) => {
    try {
        const response = await API.post(
            "/asset-requests/",
            data
        );

        return response.data;

    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export default API;
