import { supabase } from './supabase'

export const promotionService = {
  async getAll() {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getActive() {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async create(promotion) {
    const { data, error } = await supabase
      .from('promotions')
      .insert([promotion])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, promotion) {
    const { data, error } = await supabase
      .from('promotions')
      .update(promotion)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase
      .from('promotions')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  },

  // User Vouchers
  async getUserVouchers(userId) {
    const { data, error } = await supabase
      .from('user_vouchers')
      .select('*, promotions:promotion_id(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async claimVoucher(userId, promotionId) {
    const { data, error } = await supabase
      .from('user_vouchers')
      .insert([{ user_id: userId, promotion_id: promotionId }])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async useVoucher(id) {
    const { data, error } = await supabase
      .from('user_vouchers')
      .update({ is_used: true, used_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },
}
