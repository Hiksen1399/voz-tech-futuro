
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Star } from 'lucide-react';

interface ProductFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange
}) => {
  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'smartphones', label: 'Smartphones' },
    { value: 'laptops', label: 'Laptops' },
    { value: 'tablets', label: 'Tablets' },
    { value: 'wearables', label: 'Wearables' },
    { value: 'audio', label: 'Audio' },
    { value: 'vehicles', label: 'Vehículos' }
  ];

  return (
    <div className="w-full lg:w-64 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Filtros 
            <span className="text-sm font-normal text-gray-500 block">
              Tiempo real
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filtro por categoría */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Categoría
            </label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por precio */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-4 block">
              Rango de Precio
            </label>
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={100000}
                min={0}
                step={100}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>${priceRange[0].toLocaleString()}</span>
                <span>${priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Filtro por calificación */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Calificación mínima
            </label>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" name="rating" className="text-blue-600" />
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">y más</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Indicador de tiempo real */}
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-700 font-medium">
                Filtros en tiempo real
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductFilters;
