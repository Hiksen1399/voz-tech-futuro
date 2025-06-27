
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import TopProductsChart from './TopProductsChart';
import InteractionStats from './InteractionStats';
import { useAdminStats } from '@/hooks/useAdminStats';

const AdminDashboard = () => {
  const { stats, loading } = useAdminStats();

  const productData = [
    { name: 'iPhone 15 Pro', views: 2400, searches: 400 },
    { name: 'MacBook Pro M3', views: 1398, searches: 300 },
    { name: 'Samsung Watch', views: 980, searches: 200 },
    { name: 'Sony WH-1000XM5', views: 890, searches: 278 },
    { name: 'iPad Pro', views: 1200, searches: 320 }
  ];

  const categoryData = [
    { name: 'Smartphones', value: 35, color: '#3B82F6' },
    { name: 'Laptops', value: 25, color: '#8B5CF6' },
    { name: 'Audio', value: 20, color: '#10B981' },
    { name: 'Wearables', value: 15, color: '#F59E0B' },
    { name: 'Otros', value: 5, color: '#EF4444' }
  ];

  const aiSessionsData = [
    { product: 'iPhone 15 Pro', sessions: 45 },
    { product: 'MacBook Pro M3', sessions: 32 },
    { product: 'Samsung Watch', sessions: 28 },
    { product: 'Sony WH-1000XM5', sessions: 25 },
    { product: 'iPad Pro', sessions: 38 }
  ];

  return (
    <div className="space-y-8 mb-8">
      {/* Estadísticas generales - ACTUALIZADAS CON DATOS EN TIEMPO REAL */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats.totalProducts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">En tiempo real</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interacciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats.totalInteractions.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Actualizando en vivo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Producto Más Popular</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : (stats.topProducts[0]?.nombre || 'N/A')}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading ? '...' : `${stats.topProducts[0]?.popularidad || 0} interacciones`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Búsquedas por Voz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">847</div>
            <p className="text-xs text-muted-foreground">+23% esta semana</p>
          </CardContent>
        </Card>
      </div>

      {/* NUEVOS GRÁFICOS EN TIEMPO REAL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TopProductsChart />
        <InteractionStats />
      </div>

      {/* Gráficos originales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de productos más vistos */}
        <Card>
          <CardHeader>
            <CardTitle>Productos Más Vistos vs Búsquedas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#3B82F6" name="Visualizaciones" />
                <Bar dataKey="searches" fill="#8B5CF6" name="Búsquedas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de categorías */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Categorías</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              {categoryData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-sm">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de sesiones IA */}
      <Card>
        <CardHeader>
          <CardTitle>Sesiones del Agente IA por Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiSessionsData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">{item.product}</span>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-blue-600">{item.sessions}</span>
                  <span className="text-sm text-gray-600">sesiones activas</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
