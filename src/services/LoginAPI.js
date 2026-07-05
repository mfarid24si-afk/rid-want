import { supabase } from './supabase'

// LoginAPI sekarang menggunakan Supabase client
// Tetap kompatibel dengan kode lama yang mengimpornya

export const loginAPI = {
  async fetchLogin(queryFilter = '') {
    let query = supabase.from('users').select('*')
    if (queryFilter) {
      const match = queryFilter.match(/^\?(.+)=eq\.(.+)$/)
      if (match) {
        const column = match[1]
        const value = decodeURIComponent(match[2])
        query = query.eq(column, value)
      }
    }
    const { data, error } = await query
    if (error) throw error
    return data
  },

  async createLogin(data) {
    const { data: newUser, error } = await supabase.from('users').insert([data]).select()
    if (error) throw error
    return newUser
  },

  async updateLogin(id, data) {
    const { data: updated, error } = await supabase.from('users').update(data).eq('id', id).select()
    if (error) throw error
    return updated
  },

  async deleteLogin(id) {
    const { error } = await supabase.from('users').delete().eq('id', id)
    if (error) throw error
    return true
  },

  async getLogin(id) {
    const { data, error } = await supabase.from('users').select('*').eq('id', id)
    if (error) throw error
    return data
  },
}

export { supabase }