import { createContext, useContext, useState } from 'react'
import { leadsData } from '../data/mockLeads'
import { customersData } from '../data/mockCustomers'

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
    'view:users',
    'view:users:create',
    'view:users:edit',
    'view:users:delete',
  ],
  'super admin': [
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
    'view:users',
    'view:users:create',
    'view:users:edit',
    'view:users:delete',
  ],
  member: [
    'view:landing',
    'view:about',
    'view:services',
    'view:promo',
    'view:booking',
    'view:tracking',
    'view:loyalty',
    'view:voucher',
    'view:history',
    'view:customer-dashboard',
  ],
  guest: [
    'view:landing',
    'view:about',
    'view:services',
    'view:promo',
  ],
}

export function RoleProvider({ children }) {
  const [role, setRole] = useState('admin')

  // SINGLE SOURCE OF TRUTH — dibaca Admin & Guest dari sumber yang sama
  const [leads, setLeads] = useState(leadsData)
  const [customers, setCustomers] = useState(customersData)

  const switchRole = (newRole) => setRole(newRole)
  const toggleRole = () => setRole((r) => (r === 'admin' ? 'guest' : 'admin'))

  const can = (permission) =>
    PERMISSIONS[role]?.includes(permission) ?? false

  return (
    <RoleContext.Provider
      value={{ role, switchRole, toggleRole, can, leads, setLeads, customers, setCustomers }}
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