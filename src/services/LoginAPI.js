import axios from 'axios'

const API_URL = "https://uomlornefemmjqeyxvbx.supabase.co/rest/v1/login"
const API_KEY = "sb_publishable_VkzKqlUf00cshgBchFndgA_ChUQCV1X"

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
}

export const loginAPI = {
    async fetchLogin() {
        const response = await axios.get(API_URL, { headers })
        return response.data
    },

    async createLogin(data) {
        const response = await axios.post(API_URL, data, { headers })
        return response.data
    }
}