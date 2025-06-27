
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, ShoppingCart, MessageSquare } from 'lucide-react';
import { Product, useProducts } from '@/hooks/useProducts';

interface RealtimeProductCardProps {
  product: Product;
}

const RealtimeProductCard: React.FC<RealtimeProductCardProps> = ({ product }) => {
  const { createInteraction } = useProducts();

  const handleView = () => {
    createInteraction(product.id, 'vista');
  };

  const handleBuy = () => {
    createInteraction(product.id, 'compra');
  };

  const handleAIConsult = () => {
    createInteraction(product.id, 'consulta_ia');
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="aspect-square mb-4 overflow-hidden rounded-lg">
          <img
            src={product.imagen_url || '/placeholder.svg'}
            alt={product.nombre}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2">{product.nombre}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{product.descripcion}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600">
              ${product.precio.toLocaleString()}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                Stock: {product.stock}
              </Badge>
              <Badge variant="outline">
                ❤️ {product.popularidad}
              </Badge>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleView}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-1" />
              Ver
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleBuy}
              className="flex-1"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              {product.stock === 0 ? 'Sin Stock' : 'Comprar'}
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleAIConsult}
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealtimeProductCard;
