-- Create portfolio_media table for storing multiple media files per portfolio
CREATE TABLE IF NOT EXISTS public.portfolio_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'gif', 'pdf')),
  file_name TEXT NOT NULL,
  file_size INTEGER,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_cover BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolio_media_portfolio_id ON public.portfolio_media(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_media_display_order ON public.portfolio_media(portfolio_id, display_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_media_is_cover ON public.portfolio_media(portfolio_id, is_cover);

-- Enable RLS
ALTER TABLE public.portfolio_media ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view published portfolio media" ON public.portfolio_media
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.portfolios 
      WHERE portfolios.id = portfolio_media.portfolio_id 
      AND portfolios.is_published = true
    )
  );

CREATE POLICY "Users can manage their own portfolio media" ON public.portfolio_media
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.portfolios 
      WHERE portfolios.id = portfolio_media.portfolio_id 
      AND portfolios.user_id = auth.uid()
    )
  );

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_portfolio_media_updated_at 
  BEFORE UPDATE ON public.portfolio_media 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
