
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus } from 'lucide-react';

const AdminProductTable = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'iPhone 15 Pro',
      category: 'Smartphones',
      price: 1299,
      stock: 45,
      status: 'active'
    },
    {
      id: 2,
      name: 'MacBook Pro M3',
      category: 'Laptops',
      price: 1999,
      stock: 12,
      status: 'active'
    },
    {
      id: 3,
      name: 'Samsung Galaxy Watch',
      category: 'Wearables',
      price: 299,
      stock: 0,
      status: 'inactive'
    },
    {
      id: 4,
      name: 'Sony WH-1000XM5',
      category: 'Audio',
      price: 399,
      stock: 23,
      status: 'active'
    },
    {
      id: 5,
      name: 'iPad Pro 12.9"',
      category: 'Tablets',
      price: 1099,
      stock: 18,
      status: 'active'
    }
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    price: 0,
    stock: 0
  });

  const startEdit = (product: any) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock
    });
  };

  const saveEdit = () => {
    setProducts(products.map(product => 
      product.id === editingId 
        ? { ...product, ...editForm }
        : product
    ));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', category: '', price: 0, stock: 0 });
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const getStatusBadge = (status: string, stock: number) => {
    if (stock === 0) return <Badge variant="destructive">Sin Stock</Badge>;
    if (status === 'active') return <Badge variant="default">Activo</Badge>;
    return <Badge variant="secondary">Inactivo</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Gestión de Productos</CardTitle>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-4 font-medium">ID</th>
                <th className="text-left p-4 font-medium">Nombre</th>
                <th className="text-left p-4 font-medium">Categoría</th>
                <th className="text-left p-4 font-medium">Precio</th>
                <th className="text-left p-4 font-medium">Stock</th>
                <th className="text-left p-4 font-medium">Estado</th>
                <th className="text-left p-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{product.id}</td>
                  <td className="p-4">
                    {editingId === product.id ? (
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="w-full"
                      />
                    ) : (
                      product.name
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === product.id ? (
                      <Input
                        value={editForm.category}
                        onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                        className="w-full"
                      />
                    ) : (
                      product.category
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === product.id ? (
                      <Input
                        type="number"
                        value={editForm.price}
                        onChange={(e) => setEditForm({...editForm, price: Number(e.target.value)})}
                        className="w-full"
                      />
                    ) : (
                      `$${product.price.toLocaleString()}`
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === product.id ? (
                      <Input
                        type="number"
                        value={editForm.stock}
                        onChange={(e) => setEditForm({...editForm, stock: Number(e.target.value)})}
                        className="w-full"
                      />
                    ) : (
                      product.stock
                    )}
                  </td>
                  <td className="p-4">
                    {getStatusBadge(product.status, product.stock)}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {editingId === product.id ? (
                        <>
                          <Button size="sm" onClick={saveEdit} className="bg-green-600 hover:bg-green-700">
                            Guardar
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit}>
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => startEdit(product)}
                            className="hover:bg-blue-50"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => deleteProduct(product.id)}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminProductTable;
