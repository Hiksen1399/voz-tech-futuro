
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import VoiceButton from '../components/VoiceButton';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock product data - en una app real vendría de una API
  const product = {
    id: 1,
    name: 'iPhone 15 Pro',
    description: 'El smartphone más avanzado con chip A17 Pro y cámara revolucionaria',
    price: 1299,
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600'
    ],
    rating: 4.8,
    reviews: 1247,
    specs: {
      'Procesador': 'Chip A17 Pro',
      'Pantalla': '6.1" Super Retina XDR',
      'Cámara': '48MP + 12MP + 12MP',
      'Almacenamiento': '128GB, 256GB, 512GB, 1TB',
      'Batería': 'Hasta 23 horas de video',
      'Resistencia': 'IP68'
    },
    features: [
      'Cámara Pro con zoom óptico 3x',
      'Botón de Acción personalizable',
      'USB-C con USB 3',
      'Face ID avanzado',
      'Carga inalámbrica MagSafe'
    ]
  };

  const reviews = [
    {
      id: 1,
      user: 'María González',
      rating: 5,
      comment: 'Excelente producto, la cámara es increíble y la batería dura todo el día.',
      date: '15 Nov 2024'
    },
    {
      id: 2,
      user: 'Carlos Ruiz',
      rating: 4,
      comment: 'Muy buen teléfono, aunque el precio es algo elevado. La calidad es excepcional.',
      date: '10 Nov 2024'
    },
    {
      id: 3,
      user: 'Ana Martín',
      rating: 5,
      comment: 'La mejor compra que he hecho. Rápido, elegante y con una cámara profesional.',
      date: '5 Nov 2024'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-white shadow-lg">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">({product.reviews} reseñas)</span>
              </div>
              <p className="text-4xl font-bold text-blue-600 mb-4">
                ${product.price.toLocaleString()}
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg py-6">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Añadir al Carrito
              </Button>
              <Button variant="outline" className="px-8 py-6 text-blue-600 border-blue-600 hover:bg-blue-50">
                Habla con nuestro asesor IA
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Características principales:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs con información adicional */}
        <div className="mt-16">
          <Tabs defaultValue="specs" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="specs">Especificaciones</TabsTrigger>
              <TabsTrigger value="reviews">Reseñas</TabsTrigger>
              <TabsTrigger value="faq">Preguntas Frecuentes</TabsTrigger>
            </TabsList>

            <TabsContent value="specs" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Especificaciones Técnicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">{key}:</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <div className="space-y-6">
                {reviews.map(review => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{review.user}</h4>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="faq" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Preguntas Frecuentes</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">¿Incluye cargador?</h4>
                      <p className="text-gray-600">Sí, incluye cable USB-C a Lightning y adaptador de corriente.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">¿Tiene garantía?</h4>
                      <p className="text-gray-600">Incluye garantía de fabricante de 1 año y soporte técnico.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">¿Es compatible con 5G?</h4>
                      <p className="text-gray-600">Sí, es compatible con redes 5G de todas las operadoras.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <VoiceButton />
      <Footer />
    </div>
  );
};

export default ProductDetail;
