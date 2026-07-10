import { supabase } from './supabase'

export const doctorService = {
  async getAll() {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('name')
    if (error) throw error
    return data
  },

  async getActive() {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('is_active', true)
      .order('name')
    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(doctor) {
    const { data, error } = await supabase
      .from('doctors')
      .insert([doctor])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, doctor) {
    const { data, error } = await supabase
      .from('doctors')
      .update(doctor)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase
      .from('doctors')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  },

  // Doctor schedules
  async getSchedules(doctorId) {
    const { data, error } = await supabase
      .from('doctor_schedules')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('day_of_week')
      .order('start_time')
    if (error) throw error
    return data
  },

  async upsertSchedule(schedule) {
    const { data, error } = await supabase
      .from('doctor_schedules')
      .upsert([schedule], { onConflict: 'doctor_id,day_of_week,start_time' })
      .select()
    if (error) throw error
    return data
  },

  async deleteSchedule(id) {
    const { error } = await supabase
      .from('doctor_schedules')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  },
}
