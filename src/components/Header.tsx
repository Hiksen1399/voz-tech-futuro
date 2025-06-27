
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Mic, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TechMarket
            </span>
          </Link>

          {/* Barra de búsqueda */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative flex items-center">
              <Input
                type="text"
                placeholder="Buscar productos tecnológicos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-12 py-3 text-lg rounded-full border-2 border-gray-200 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-blue-100"
                disabled={!isAuthenticated}
              >
                <Mic className={`w-5 h-5 ${isAuthenticated ? 'text-blue-600' : 'text-gray-400'}`} />
              </Button>
            </div>
          </div>

          {/* Navegación */}
          <nav className="flex items-center space-x-6">
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Productos
            </Link>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="relative"
              disabled={!isAuthenticated}
            >
              <ShoppingCart className={`w-5 h-5 mr-2 ${isAuthenticated ? '' : 'text-gray-400'}`} />
              Carrito
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Button>

            {/* Auth Section */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span className="hidden md:inline">
                      {profile?.role === 'admin' ? 'Admin' : 'Cliente'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="font-medium">
                    {profile?.email}
                  </DropdownMenuItem>
                  {profile?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Panel de Admin</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link to="/auth">Iniciar Sesión</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
