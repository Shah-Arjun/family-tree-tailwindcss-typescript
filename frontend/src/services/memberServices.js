import axios from 'axios'

// Backend base URL
const API_URL = "http://localhost:5000/api/family/";

//GET all members
export const getMembers = async () => {
    const res = await axios.get(API_URL);
    return res.data;
}