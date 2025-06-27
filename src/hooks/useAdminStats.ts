
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalProducts: number;
  totalInteractions: number;
  topProducts: Array<{
    id: string;
    nombre: string;
    popularidad: number;
  }>;
  interactionsByType: Array<{
    tipo: string;
    count: number;
  }>;
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalProducts: 0,
    totalInteractions: 0,
    topProducts: [],
    interactionsByType: []
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      // Total de productos
      const { count: productCount } = await supabase
        .from('productos')
        .select('*', { count: 'exact', head: true });

      // Total de interacciones
      const { count: interactionCount } = await supabase
        .from('interacciones')
        .select('*', { count: 'exact', head: true });

      // Top 5 productos más populares
      const { data: topProductsData } = await supabase
        .from('productos')
        .select('id, nombre, popularidad')
        .order('popularidad', { ascending: false })
        .limit(5);

      // Interacciones por tipo
      const { data: interactionsByType } = await supabase
        .from('interacciones')
        .select('tipo')
        .order('tipo');

      // Contar interacciones por tipo
      const typeCounts = interactionsByType?.reduce((acc: Record<string, number>, curr) => {
        acc[curr.tipo] = (acc[curr.tipo] || 0) + 1;
        return acc;
      }, {}) || {};

      const interactionTypeData = Object.entries(typeCounts).map(([tipo, count]) => ({
        tipo,
        count: count as number
      }));

      setStats({
        totalProducts: productCount || 0,
        totalInteractions: interactionCount || 0,
        topProducts: topProductsData || [],
        interactionsByType: interactionTypeData
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Suscribirse a cambios en tiempo real
    const productsChannel = supabase
      .channel('admin-stats-productos')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'productos'
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    const interactionsChannel = supabase
      .channel('admin-stats-interacciones')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'interacciones'
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(interactionsChannel);
    };
  }, []);

  return { stats, loading, refetch: fetchStats };
};
