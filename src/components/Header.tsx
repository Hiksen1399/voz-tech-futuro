
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

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
              >
                <Mic className="w-5 h-5 text-blue-600" />
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
            <Button variant="outline" size="sm" className="relative">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Carrito
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
