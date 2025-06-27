
-- Crear tabla de productos
CREATE TABLE public.productos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  categoria TEXT NOT NULL,
  imagen_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  popularidad INTEGER NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de interacciones
CREATE TABLE public.interacciones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  producto_id UUID NOT NULL REFERENCES public.productos(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('vista', 'compra', 'consulta_ia')),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interacciones ENABLE ROW LEVEL SECURITY;

-- Políticas para productos (todos pueden ver, solo admins pueden modificar)
CREATE POLICY "Anyone can view active products" 
  ON public.productos 
  FOR SELECT 
  USING (activo = true);

CREATE POLICY "Admins can manage products" 
  ON public.productos 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Políticas para interacciones
CREATE POLICY "Users can view their own interactions" 
  ON public.interacciones 
  FOR SELECT 
  USING (usuario_id = auth.uid());

CREATE POLICY "Users can create interactions" 
  ON public.interacciones 
  FOR INSERT 
  WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "Admins can view all interactions" 
  ON public.interacciones 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Función para actualizar popularidad automáticamente
CREATE OR REPLACE FUNCTION public.update_product_popularity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  UPDATE public.productos 
  SET popularidad = popularidad + 1,
      updated_at = now()
  WHERE id = NEW.producto_id;
  RETURN NEW;
END;
$$;

-- Trigger para actualizar popularidad cuando se crea una interacción
CREATE TRIGGER on_interaction_created
  AFTER INSERT ON public.interacciones
  FOR EACH ROW EXECUTE FUNCTION public.update_product_popularity();

-- Habilitar realtime para las tablas
ALTER TABLE public.productos REPLICA IDENTITY FULL;
ALTER TABLE public.interacciones REPLICA IDENTITY FULL;

-- Agregar tablas a la publicación de realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.productos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.interacciones;

-- Insertar algunos productos de ejemplo
INSERT INTO public.productos (nombre, descripcion, precio, categoria, imagen_url, stock, popularidad) VALUES
('iPhone 15 Pro', 'El smartphone más avanzado con chip A17 Pro', 1299.00, 'smartphones', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400', 25, 45),
('MacBook Pro M3', 'Laptop profesional con chip M3 para máxima productividad', 1999.00, 'laptops', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', 15, 32),
('Samsung Galaxy Watch', 'Smartwatch con monitoreo de salud avanzado', 299.00, 'wearables', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 40, 28),
('Sony WH-1000XM5', 'Audífonos inalámbricos con cancelación activa de ruido', 399.00, 'audio', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 30, 25),
('iPad Pro 12.9"', 'Tablet profesional con chip M2 y pantalla Liquid Retina', 1099.00, 'tablets', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', 20, 38),
('Tesla Model S Plaid', 'Vehículo eléctrico de alto rendimiento con autopilot', 89990.00, 'vehicles', 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400', 3, 15);
