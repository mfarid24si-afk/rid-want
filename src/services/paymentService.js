import { supabase } from './supabase'

export const paymentService = {
  async getAll() {
    const { data, error } = await supabase
      .from('payments')
      .select('*, appointments:appointment_id(*)')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getByAppointmentId(appointmentId) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('appointment_id', appointmentId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async create(payment) {
    const { data, error } = await supabase
      .from('payments')
      .insert([{
        ...payment,
        paid_at: payment.status === 'paid' ? new Date().toISOString() : null,
      }])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, payment) {
    const updateData = { ...payment }
    if (payment.status === 'paid' && !payment.paid_at) {
      updateData.paid_at = new Date().toISOString()
    }
    const { data, error } = await supabase
      .from('payments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  },
}
