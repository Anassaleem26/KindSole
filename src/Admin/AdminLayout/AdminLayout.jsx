import React from 'react'
import AdminSidebar from '../AdminSidebar'
import { AdminNavbar } from './AdminNavbar'
import { Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f4f4]">
      <AdminSidebar />

      <div className="flex flex-col flex-1 overflow-y-auto">
        <AdminNavbar />
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}