import { supabase } from './supabase'

export const supportService = {
  // ─── TIKET SUPPORT ───

  async getTickets(filters = {}) {
    let query = supabase
      .from('support_tickets')
      .select('*, users:user_id(name, email, phone), assignee:assigned_to(name)')
      .order('created_at', { ascending: false })

    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }
    if (filters.priority && filters.priority !== 'all') {
      query = query.eq('priority', filters.priority)
    }
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async getTicketById(id) {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*, users:user_id(*), assignee:assigned_to(name)')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async getUserTickets(userId) {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async createTicket(ticket) {
    const { data, error } = await supabase
      .from('support_tickets')
      .insert([{
        user_id: ticket.user_id || null,
        subject: ticket.subject,
        description: ticket.description || '',
        category: ticket.category || 'general',
        priority: ticket.priority || 'medium',
        status: 'open',
      }])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateTicket(id, updates) {
    const updateData = { ...updates }
    if (updates.status === 'resolved' || updates.status === 'closed') {
      updateData.resolved_at = new Date().toISOString()
    }
    const { data, error } = await supabase
      .from('support_tickets')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteTicket(id) {
    const { error } = await supabase
      .from('support_tickets')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  },

  // ─── PESAN TIKET ───

  async getMessages(ticketId) {
    const { data, error } = await supabase
      .from('ticket_messages')
      .select('*, users:user_id(name)')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true })
    if (error) throw error
    return data || []
  },

  async addMessage({ ticketId, userId, message, isStaff = false }) {
    const { data, error } = await supabase
      .from('ticket_messages')
      .insert([{
        ticket_id: ticketId,
        user_id: userId,
        message,
        is_staff: isStaff,
      }])
      .select()
      .single()
    if (error) throw error
    return data
  },

  // ─── KOMPLAIN ───

  async getComplaints() {
    const { data, error } = await supabase
      .from('complaints')
      .select('*, users:user_id(name, email), resolver:resolved_by(name), appointments:appointment_id(appointment_date, treatments:treatment_id(name))')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async getComplaintById(id) {
    const { data, error } = await supabase
      .from('complaints')
      .select('*, users:user_id(*), resolver:resolved_by(name), appointments:appointment_id(*)')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async createComplaint(complaint) {
    const { data, error } = await supabase
      .from('complaints')
      .insert([complaint])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateComplaint(id, updates) {
    const updateData = { ...updates }
    if (updates.status === 'resolved' || updates.status === 'closed') {
      updateData.resolved_at = new Date().toISOString()
    }
    const { data, error } = await supabase
      .from('complaints')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // ─── NOTIFIKASI ───

  async getNotifications(userId) {
    const { data, error } = await supabase
      .rpc('get_user_notifications', { p_user_id: userId })
    if (error) throw error
    return data || []
  },

  async getUnreadCount(userId) {
    const { data, error } = await supabase
      .rpc('get_unread_count', { p_user_id: userId })
    if (error) throw error
    return data || 0
  },

  async markNotifRead(notifId) {
    await supabase.rpc('mark_notification_read', { p_notif_id: notifId })
  },

  // ─── UPCOMING APPOINTMENTS (untuk reminder) ───

  async getUpcomingAppointments() {
    const { data, error } = await supabase
      .rpc('get_upcoming_appointments')
    if (error) throw error
    return data || []
  },

  // ─── NOTIFIKASI MASSAL ───

  async sendBulkNotification({ channel, type, title, message, targetSegment }) {
    // Cari user berdasarkan segment
    let query = supabase.from('users').select('id').eq('role', 'member')
    
    if (targetSegment && targetSegment !== 'all') {
      if (['gold', 'silver', 'bronze'].includes(targetSegment)) {
        // Filter by points-based tier
        const thresholds = { gold: 2000, silver: 500, bronze: 0 }
        const min = thresholds[targetSegment]
        query = query.gte('points', min)
        if (targetSegment === 'silver') query = query.lt('points', 2000)
        if (targetSegment === 'bronze') query = query.lt('points', 500)
      }
    }

    const { data: users } = await query
    if (!users?.length) return { sent: 0 }

    const notifications = users.map(u => ({
      user_id: u.id,
      channel,
      type,
      title,
      message,
      status: 'sent',
    }))

    const { error } = await supabase
      .from('notification_log')
      .insert(notifications)
    if (error) throw error

    return { sent: notifications.length }
  },
}
