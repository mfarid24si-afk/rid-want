import { createContext, useContext, useState } from 'react'
import { leadsData } from '../data/mockLeads'

const RoleContext = createContext(null)

export const PERMISSIONS = {
  admin: [
    'view:dashboard',
    'view:analytics',
    'view:customers',
    'view:customers:edit',
    'view:customers:delete',
    'view:orders',
    'view:leads',
    'view:leads:edit',
    'view:collaboration',
    'view:settings',
    'view:marketing',
  ],
  guest: [
    'view:queue',
    'view:catalog',
    'view:register',
  ],
}

export function RoleProvider({ children }) {
  const [role, setRole] = useState('admin')

  // ─── SHARED STATE ─────────────────────────────────────────────
  // State leads diletakkan di sini agar Admin & Guest
  // membaca & menulis sumber data yang SAMA (single source of truth).
  // Perubahan Admin (tambah/hapus lead) langsung terefleksi
  // di tampilan Guest tanpa refresh, karena keduanya consume
  // context ini.
  const [leads, setLeads] = useState(leadsData)

  const switchRole = (newRole) => setRole(newRole)
  const toggleRole = () => setRole(r => (r === 'admin' ? 'guest' : 'admin'))

  const can = (permission) =>
    PERMISSIONS[role]?.includes(permission) ?? false

  return (
    <RoleContext.Provider
      value={{ role, switchRole, toggleRole, can, leads, setLeads }}
    >
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole must be used inside RoleProvider')
  return ctx
}