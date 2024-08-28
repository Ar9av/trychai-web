//components/FetchingData.jsx
const { default: axios } = require("axios");

const baseURL = "https://91e2nq3dy2.execute-api.us-east-2.amazonaws.com/dev/fast?topic=indian%20tyre%20market";
export const FetchingData = async () => {
    try {
        const response = await axios.get(baseURL);
        return response.data;
    } catch (error) {
        console.error('Error fetching food data:', error.message);
        console.error('Error details:', error); // Log the full error details
        throw error;
    }
};
