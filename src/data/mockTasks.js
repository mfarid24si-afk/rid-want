export const tasksData = [
  { id: 'T001', title: 'Siapkan ruang treatment Botox', assignee: 'Beautician Rika', patient: 'Diana Sari', dueTime: '14:30', priority: 'high',   status: 'pending',  avatar: 'BR' },
  { id: 'T002', title: 'Sterilisasi alat facial',      assignee: 'Perawat Sari',    patient: 'Sarah Wijaya', dueTime: '09:00', priority: 'high',   status: 'done',     avatar: 'PS' },
  { id: 'T003', title: 'Konfirmasi janji temu besok',  assignee: 'Resepsionis Dina', patient: 'Putri Amanda', dueTime: '17:00', priority: 'medium', status: 'pending',  avatar: 'RD' },
  { id: 'T004', title: 'Restock serum vitamin C',      assignee: 'Admin Stok',      patient: '-',           dueTime: '15:00', priority: 'medium', status: 'pending',  avatar: 'AS' },
  { id: 'T005', title: 'Kirim voucher ulang tahun',    assignee: 'Admin CRM',       patient: 'Sinta M.',    dueTime: '10:00', priority: 'low',    status: 'done',     avatar: 'AC' },
]

export const timelineData = [
  {
    id: 'TL001', patient: 'Sarah Wijaya', avatar: 'SW',
    events: [
      { date: '05 Jun 2024', type: 'treatment', title: 'Facial Glow Premium', note: 'Kulit terlihat lebih cerah, pasien sangat puas. Rekomendasi untuk lanjut 1x sebulan.', staff: 'Dr. Sarah', icon: 'sparkles' },
      { date: '10 Apr 2024', type: 'consultation', title: 'Konsultasi Kulit Kusam', note: 'Pasien mengeluh kulit kusam dan pori-pori besar. Direkomendasikan paket Facial Glow.', staff: 'Dr. Lina', icon: 'message' },
      { date: '01 Mar 2024', type: 'purchase', title: 'Beli Paket Treatment 5x', note: 'Pembelian paket hemat 5x Facial Basic. Total Rp 2.500.000.', staff: 'Resepsionis Dina', icon: 'credit' },
    ]
  },
  {
    id: 'TL002', patient: 'Sinta Maharani', avatar: 'SM',
    events: [
      { date: '01 Jun 2024', type: 'treatment', title: 'Anti Aging Premium Session 3', note: 'Hasil signifikan. Garis halus berkurang 40%. Pasien request foto before-after.', staff: 'Dr. Maya', icon: 'sparkles' },
      { date: '15 May 2024', type: 'complaint', title: 'Keluhan: Kemerahan Pasca Treatment', note: 'Pasien melaporkan kemerahan ringan selama 2 hari. Diberikan calming serum gratis.', staff: 'Dr. Maya', icon: 'alert' },
      { date: '01 May 2024', type: 'treatment', title: 'Anti Aging Premium Session 2', note: 'Berjalan lancar. Pasien sangat kooperatif.', staff: 'Dr. Maya', icon: 'sparkles' },
    ]
  },
]