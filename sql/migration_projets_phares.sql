-- ============================================================================
-- Migration: Add Featured Projects (Projets Phares)
-- DRNOFLU - Direction des Recettes Non Fiscales du Lualaba
-- ============================================================================

-- Add columns for featured projects
ALTER TABLE cartographie_projets 
ADD COLUMN IF NOT EXISTS est_phare BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ordre_phare INTEGER CHECK (ordre_phare IS NULL OR (ordre_phare >= 1 AND ordre_phare <= 3)),
ADD COLUMN IF NOT EXISTS image_principale TEXT;

-- Create index for better performance on featured projects queries
CREATE INDEX IF NOT EXISTS idx_projets_phare ON cartographie_projets(est_phare) WHERE est_phare = TRUE;

-- Add comment for documentation
COMMENT ON COLUMN cartographie_projets.est_phare IS 'Indique si ce projet est un projet phare affiché sur la page d''accueil';
COMMENT ON COLUMN cartographie_projets.ordre_phare IS 'Ordre d''affichage du projet phare (1, 2, ou 3)';
COMMENT ON COLUMN cartographie_projets.image_principale IS 'URL de l''image principale du projet';

-- ============================================================================
-- Create site_settings table if it doesn't exist
-- ============================================================================
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cle TEXT NOT NULL UNIQUE,
    valeur TEXT DEFAULT '',
    description TEXT,
    type TEXT DEFAULT 'text' CHECK (type IN ('text', 'image', 'json', 'html', 'number')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policies for site_settings
DROP POLICY IF EXISTS "Settings are viewable by everyone" ON site_settings;
CREATE POLICY "Settings are viewable by everyone" ON site_settings
    FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Only admins can manage settings" ON site_settings;
CREATE POLICY "Only admins can manage settings" ON site_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('super_admin', 'admin')
        )
    );

-- Add setting for projets phares background image
INSERT INTO site_settings (cle, valeur, description, type) 
VALUES ('projets_phares_background', '', 'Image de fond pour la section Projets Phares', 'image')
ON CONFLICT (cle) DO NOTHING;

-- Ensure only 3 projects can be featured at a time (via application logic, not constraint)
-- The application should enforce this rule when setting est_phare = TRUE
