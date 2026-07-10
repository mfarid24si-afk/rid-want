import { supabase } from './supabase'

export const appointmentService = {
  async getAll() {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, treatments:treatment_id(*), doctors:doctor_id(*), users:user_id(*)')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getByUserId(userId) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, treatments:treatment_id(*), doctors:doctor_id(*)')
      .eq('user_id', userId)
      .order('appointment_date', { ascending: false })
    if (error) throw error
    return data
  },

  async getByDate(date) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, treatments:treatment_id(*), doctors:doctor_id(*)')
      .eq('appointment_date', date)
      .order('appointment_time')
    if (error) throw error
    return data
  },

  async getByStatus(status) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, treatments:treatment_id(*), doctors:doctor_id(*)')
      .eq('status', status)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, treatments:treatment_id(*), doctors:doctor_id(*)')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(appointment) {
    // Cek overbooking dulu
    const { data: checkData, error: checkError } = await supabase
      .rpc('check_overbooking', {
        p_doctor_id: appointment.doctor_id,
        p_date: appointment.appointment_date,
        p_time: appointment.appointment_time,
      })
    if (checkError) throw checkError

    if (!checkData) {
      throw new Error('Jadwal sudah dibooking! Silakan pilih waktu lain.')
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert([appointment])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, appointment) {
    const { data, error } = await supabase
      .from('appointments')
      .update(appointment)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  },
}
