
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useAdminStats } from '@/hooks/useAdminStats';

const InteractionStats = () => {
  const { stats, loading } = useAdminStats();

  const colors = {
    vista: '#3B82F6',
    compra: '#10B981',
    consulta_ia: '#8B5CF6'
  };

  const typeLabels = {
    vista: 'Vistas',
    compra: 'Compras',
    consulta_ia: 'Consultas IA'
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Interacciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = stats.interactionsByType.map(item => ({
    ...item,
    name: typeLabels[item.tipo as keyof typeof typeLabels] || item.tipo,
    color: colors[item.tipo as keyof typeof colors] || '#6B7280'
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tipos de Interacciones (Tiempo Real)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey="count"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {chartData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm">{entry.name}: {entry.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractionStats;
