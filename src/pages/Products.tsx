
import React, { useState } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import Footer from '../components/Footer';
import VoiceButton from '../components/VoiceButton';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 2000]);

  const products = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      description: 'El smartphone más avanzado con chip A17 Pro',
      price: 1299,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      category: 'smartphones',
      rating: 4.8
    },
    {
      id: 2,
      name: 'MacBook Pro M3',
      description: 'Laptop profesional con chip M3 para máxima productividad',
      price: 1999,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
      category: 'laptops',
      rating: 4.9
    },
    {
      id: 3,
      name: 'Samsung Galaxy Watch',
      description: 'Smartwatch con monitoreo de salud avanzado',
      price: 299,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      category: 'wearables',
      rating: 4.6
    },
    {
      id: 4,
      name: 'Sony WH-1000XM5',
      description: 'Audífonos inalámbricos con cancelación activa de ruido',
      price: 399,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      category: 'audio',
      rating: 4.7
    },
    {
      id: 5,
      name: 'iPad Pro 12.9"',
      description: 'Tablet profesional con chip M2 y pantalla Liquid Retina',
      price: 1099,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
      category: 'tablets',
      rating: 4.8
    },
    {
      id: 6,
      name: 'Tesla Model S Plaid',
      description: 'Vehículo eléctrico de alto rendimiento con autopilot',
      price: 89990,
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400',
      category: 'vehicles',
      rating: 4.5
    }
  ];

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    return categoryMatch && priceMatch;
  });

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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Productos Tecnológicos</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
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
