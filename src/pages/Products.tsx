
import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import ProductFilters from '../components/ProductFilters';
import ProductSearch from '../components/ProductSearch';
import RealtimeProductCard from '../components/RealtimeProductCard';
import Footer from '../components/Footer';
import VoiceButton from '../components/VoiceButton';
import { useProducts } from '@/hooks/useProducts';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [searchQuery, setSearchQuery] = useState('');
  const { products, loading } = useProducts();

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Filtro por categoría
      const categoryMatch = selectedCategory === 'all' || product.categoria === selectedCategory;
      
      // Filtro por precio
      const priceMatch = product.precio >= priceRange[0] && product.precio <= priceRange[1];
      
      // Filtro por búsqueda
      const searchMatch = searchQuery === '' || 
        product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.descripcion && product.descripcion.toLowerCase().includes(searchQuery.toLowerCase()));

      return categoryMatch && priceMatch && searchMatch;
    });
  }, [products, selectedCategory, priceRange, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProductFilters 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Productos Tecnológicos 
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (Actualizados en tiempo real)
                </span>
              </h1>
              <ProductSearch 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-500">
                  Intenta ajustar los filtros o la búsqueda
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <RealtimeProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>🔄 Tiempo Real:</strong> Los productos se actualizan automáticamente. 
                Los cambios en stock, precios y popularidad se reflejan instantáneamente.
              </p>
            </div>
          </div>
        </div>
      </div>
      <VoiceButton />
      <Footer />
    </div>
  );
};

export default Products;
