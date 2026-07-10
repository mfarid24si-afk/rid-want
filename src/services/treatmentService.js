import { supabase } from './supabase'

export const treatmentService = {
  async getAll() {
    const { data, error } = await supabase
      .from('treatments')
      .select('*')
      .order('name')
    if (error) throw error
    return data
  },

  async getActive() {
    const { data, error } = await supabase
      .from('treatments')
      .select('*')
      .eq('is_active', true)
      .order('name')
    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('treatments')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(treatment) {
    const { data, error } = await supabase
      .from('treatments')
      .insert([treatment])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, treatment) {
    const { data, error } = await supabase
      .from('treatments')
      .update(treatment)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase
      .from('treatments')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  },
}
