-- Crea la tabla con id UUID
CREATE TABLE public.producto_embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT,
  metadata JSONB,
  embedding VECTOR(768)
);

-- Índice para búsquedas vectoriales
CREATE INDEX ON public.producto_embeddings USING ivfflat (embedding vector_cosine_ops);

-- Habilitar RLS y políticas como antes...
ALTER TABLE public.producto_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage embeddings" 
  ON public.producto_embeddings 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Anyone can search embeddings" 
  ON public.producto_embeddings 
  FOR SELECT 
  USING (true);

ALTER TABLE public.producto_embeddings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.producto_embeddings;