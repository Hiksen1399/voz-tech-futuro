
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminHeader = () => {
  const { profile } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-600">
                Gestión del marketplace - Bienvenido, {profile?.email}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Administrador
              </span>
            </div>
            
            <Link to="/">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al sitio</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
