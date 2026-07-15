import { supabase } from './supabase'

/**
 * Unified Notification Service
 * 
 * Mencatat semua notifikasi ke tabel notification_log.
 * Untuk pengiriman email/WhatsApp nyata, service ini siap
 * dipanggil via Resend (email) atau Meta Cloud API (WhatsApp).
 * 
 * Saat ini: semua notifikasi dicatat di database untuk ditampilkan
 * in-app. Integrasi API pihak ketiga bisa ditambahkan nanti tanpa
 * mengubah struktur kode.
 */

// ─── Threshold Poin ───
export const TIER_THRESHOLDS = {
  bronze: { min: 0, max: 499, label: '🥉 Bronze', color: '#CD7F32' },
  silver: { min: 500, max: 1999, label: '🥈 Silver', color: '#9CA3AF' },
  gold:   { min: 2000, max: Infinity, label: '🥇 Gold', color: '#FFD700' },
}

export function calculateTier(points) {
  if (points >= 2000) return 'gold'
  if (points >= 500) return 'silver'
  return 'bronze'
}

// ─── Kirim Notifikasi ke Database ───
export async function sendNotification({
  userId,
  channel = 'in_app',
  type,
  title,
  message,
  referenceType,
  referenceId,
}) {
  try {
    const { error } = await supabase
      .from('notification_log')
      .insert([{
        user_id: userId,
        channel,
        type,
        title,
        message,
        status: 'sent',
        reference_type: referenceType,
        reference_id: referenceId,
      }])
    if (error) throw error
    return true
  } catch (err) {
    console.error('Gagal mencatat notifikasi:', err)
    return false
  }
}

// ─── Kirim Notifikasi ke Banyak User ───
export async function sendBulkNotifications(users, { channel, type, title, message }) {
  const notifications = users.map(u => ({
    user_id: u.id,
    channel,
    type,
    title,
    message: typeof message === 'function' ? message(u) : message,
    status: 'sent',
  }))

  try {
    const { error } = await supabase
      .from('notification_log')
      .insert(notifications)
    if (error) throw error
    return true
  } catch (err) {
    console.error('Gagal mengirim notifikasi massal:', err)
    return false
  }
}

// ─── Ambil Notifikasi User ───
export async function getUserNotifications(userId) {
  try {
    const { data, error } = await supabase
      .rpc('get_user_notifications', { p_user_id: userId })
    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Gagal memuat notifikasi:', err)
    return []
  }
}

// ─── Hitung Notifikasi Belum Dibaca ───
export async function getUnreadCount(userId) {
  try {
    const { data, error } = await supabase
      .rpc('get_unread_count', { p_user_id: userId })
    if (error) throw error
    return data || 0
  } catch (err) {
    return 0
  }
}

// ─── Tandai Notifikasi Dibaca ───
export async function markAsRead(notifId) {
  try {
    await supabase.rpc('mark_notification_read', { p_notif_id: notifId })
    return true
  } catch (err) {
    console.error('Gagal menandai notifikasi:', err)
    return false
  }
}

// ─── Kirim Notifikasi Aktivasi Membership ───
export async function sendMembershipNotification(userId, tier, points) {
  const tierLabels = { gold: '🥇 Gold', silver: '🥈 Silver', bronze: '🥉 Bronze' }
  const nextTier = tier === 'bronze' ? 'Silver (500 poin)' : tier === 'silver' ? 'Gold (2.000 poin)' : null

  let message = `Selamat! Status membership Anda naik ke ${tierLabels[tier]} dengan ${points.toLocaleString('id-ID')} poin!`
  if (nextTier) {
    message += ` Kumpulkan ${nextTier === 'Silver (500 poin)' ? `${500 - points} poin lagi` : `${2000 - points} poin lagi`} untuk naik ke ${nextTier}.`
  }

  return sendNotification({
    userId,
    type: 'promotion',
    title: `🏆 ${tierLabels[tier]} Member!`,
    message,
  })
}

// ─── Kirim Notifikasi Reminder Jadwal ───
export async function sendAppointmentReminder(appointment) {
  if (!appointment?.user_id) return false

  const dateStr = new Date(appointment.appointment_date).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  return sendNotification({
    userId: appointment.user_id,
    channel: 'in_app',
    type: 'reminder',
    title: '⏰ Pengingat Janji Temu',
    message: `Halo! Anda memiliki jadwal ${appointment.treatment_name || 'treatment'} bersama ${appointment.doctor_name || 'dokter'} pada ${dateStr} pukul ${appointment.appointment_time?.slice(0, 5) || '-'}.`,
    referenceType: 'appointment',
    referenceId: appointment.id,
  })
}

// ─── Kirim Notifikasi Tiket Support ───
export async function sendTicketNotification(ticketId, userId, subject, status) {
  const statusLabels = {
    open: 'dibuka',
    in_progress: 'dalam proses',
    waiting_customer: 'menunggu respon Anda',
    resolved: 'telah diselesaikan',
    closed: 'ditutup',
  }

  return sendNotification({
    userId,
    type: 'support',
    title: '🎫 Update Tiket Support',
    message: `Tiket "${subject}" ${statusLabels[status] || status}. Tim kami akan segera menghubungi Anda.`,
    referenceType: 'ticket',
    referenceId: ticketId,
  })
}

// ─── Kirim Notifikasi Komplain ───
export async function sendComplaintNotification(userId, title, status) {
  const statusLabels = {
    open: 'telah diterima dan akan segera ditangani',
    investigating: 'sedang dalam investigasi',
    resolved: 'telah diselesaikan',
    closed: 'telah ditutup',
  }

  return sendNotification({
    userId,
    type: 'complaint',
    title: '📋 Update Komplain',
    message: `Komplain "${title}" ${statusLabels[status] || status}.`,
    referenceType: 'complaint',
  })
}

// ─── Kirim Notifikasi Promo ───
export async function sendPromoNotification(userId, promoTitle, discountPct, code) {
  return sendNotification({
    userId,
    type: 'promotion',
    title: '🎉 Promo Spesial Untukmu!',
    message: `Dapatkan diskon ${discountPct}% untuk "${promoTitle}"! Gunakan kode: ${code}.`,
  })
}
