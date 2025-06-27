
import React from 'react';
import AdminHeader from '../components/AdminHeader';
import AdminDashboard from '../components/AdminDashboard';
import AdminProductTable from '../components/AdminProductTable';

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Panel de Administración</h1>
        <AdminDashboard />
        <AdminProductTable />
      </div>
    </div>
  );
};

export default Admin;
