-- Script pour recréer complètement la base de données avec encodage UTF-8
-- À exécuter dans pgAdmin (connecté à la base 'postgres', pas 'tastywall')

-- 1. Terminer toutes les connexions à la base de données
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'tastywall'
  AND pid <> pg_backend_pid();

-- 2. Supprimer la base de données
DROP DATABASE IF EXISTS tastywall;

-- 3. Recréer la base avec encodage UTF-8 et collation compatible
-- IMPORTANT: On utilise 'C' pour la collation au lieu de 'French_France.1252'
-- qui n'est pas compatible avec UTF-8
CREATE DATABASE tastywall
  WITH
  ENCODING = 'UTF8'
  LC_COLLATE = 'C'
  LC_CTYPE = 'C'
  TEMPLATE = template0;

-- Alternative avec collation française UTF-8 (si disponible sur Windows):
-- CREATE DATABASE tastywall
--   WITH
--   ENCODING = 'UTF8'
--   LC_COLLATE = 'fr_FR.UTF-8'
--   LC_CTYPE = 'fr_FR.UTF-8'
--   TEMPLATE = template0;

-- 4. Se connecter à la nouvelle base tastywall (à faire manuellement dans pgAdmin)
-- Puis exécuter ces commandes pour vérifier l'encodage:
-- SHOW SERVER_ENCODING;  -- Doit afficher UTF8
-- SHOW CLIENT_ENCODING;  -- Doit afficher UTF8
-- SHOW LC_COLLATE;       -- Doit afficher C (ou fr_FR.UTF-8)
-- SHOW LC_CTYPE;         -- Doit afficher C (ou fr_FR.UTF-8)
