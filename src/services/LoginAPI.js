import axios from 'axios'

const API_URL = "https://uomlornefemmjqeyxvbx.supabase.co/rest/v1/login"
const API_KEY = "sb_publishable_VkzKqlUf00cshgBchFndgA_ChUQCV1X"

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
}

const supabaseHeaders = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
}

export const loginAPI = {
    async fetchLogin(queryFilter = "") {
        const response = await axios.get(`${API_URL}${queryFilter}`, { headers: supabaseHeaders })
        return response.data
    },

    async createLogin(data) {
        const response = await axios.post(API_URL, data, { headers: supabaseHeaders })
        return response.data
    },

    async updateLogin(id, data) {
        const response = await axios.patch(`${API_URL}?id=eq.${id}`, data, { headers: supabaseHeaders })
        return response.data
    },

    async deleteLogin(id) {
        const response = await axios.delete(`${API_URL}?id=eq.${id}`, { headers: supabaseHeaders })
        return response.data
    },

    async getLogin(id) {
        const response = await axios.get(`${API_URL}?id=eq.${id}`, { headers: supabaseHeaders })
        return response.data
    }
}