import axios from 'axios'

// Backend base URL
const API_URL = "http://localhost:5000/api/family/";


//Add a new member
export const addMember = async (member) => {
    const res = await axios.post(API_URL, member);
    return res.data;
}


//GET all members
export const getMembers = async () => {
    const res = await axios.get(API_URL);
    return res.data;
}

//GET single member by ID
export const getMemberById = async (id) => {
    const res = await axios.get(`${API_URL}${id}`);
    return res.data;
}

