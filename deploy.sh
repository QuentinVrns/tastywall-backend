#!/bin/bash

# ========================================
# Script de déploiement pour o2switch
# ========================================

echo "🚀 Début du déploiement de Tastywall Backend..."

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Vérifier que le fichier .env existe
if [ ! -f .env ]; then
    echo -e "${RED}❌ Erreur: Le fichier .env n'existe pas!${NC}"
    echo "Créez un fichier .env avec vos variables d'environnement"
    exit 1
fi

echo -e "${YELLOW}📦 Installation des dépendances...${NC}"
npm install --production

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors de l'installation des dépendances${NC}"
    exit 1
fi

echo -e "${YELLOW}🔨 Build de l'application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors du build${NC}"
    exit 1
fi

echo -e "${YELLOW}🗄️  Génération du client Prisma...${NC}"
npx prisma generate

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors de la génération Prisma${NC}"
    exit 1
fi

echo -e "${YELLOW}📊 Application des migrations de base de données...${NC}"
npx prisma migrate deploy

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors des migrations${NC}"
    exit 1
fi

# Créer le dossier logs si il n'existe pas
mkdir -p logs

echo -e "${YELLOW}🔄 Redémarrage de l'application avec PM2...${NC}"

# Vérifier si PM2 est installé
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚙️  Installation de PM2...${NC}"
    npm install -g pm2
fi

# Démarrer ou redémarrer l'application
if pm2 list | grep -q "tastywall-backend"; then
    echo -e "${YELLOW}🔄 Redémarrage de l'application existante...${NC}"
    pm2 restart ecosystem.config.js
else
    echo -e "${YELLOW}▶️  Démarrage de l'application...${NC}"
    pm2 start ecosystem.config.js
fi

# Sauvegarder la configuration PM2
pm2 save

echo -e "${GREEN}✅ Déploiement terminé avec succès!${NC}"
echo ""
echo "Commandes utiles:"
echo "  - Voir les logs: pm2 logs tastywall-backend"
echo "  - Voir le status: pm2 status"
echo "  - Redémarrer: pm2 restart tastywall-backend"
echo "  - Arrêter: pm2 stop tastywall-backend"
echo ""
