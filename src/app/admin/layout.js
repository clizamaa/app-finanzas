'use client'

import AdminProtectedRoute from '@/components/AdminProtectedRoute'

const AdminLayout = ({ children }) => {
  return (
    <AdminProtectedRoute>
      {children}
    </AdminProtectedRoute>
  )
}

export default AdminLayout