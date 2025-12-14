# 🚀 Déploiement sur o2switch via GitHub

Ce guide explique comment déployer votre backend Tastywall sur o2switch en utilisant GitHub comme source.

---

## 📋 Prérequis

- ✅ Compte GitHub avec votre repo : `https://github.com/QuentinVrns/tastywall-backend.git`
- ✅ Accès SSH à o2switch (serveur : `chataigner.o2switch.net`)
- ✅ Node.js 22 configuré sur o2switch
- ✅ Base de données PostgreSQL créée sur o2switch
- ✅ PM2 installé sur o2switch

---

## 🔧 Configuration initiale sur o2switch (Une seule fois)

### 1. Se connecter au serveur

```bash
ssh wosi9734@chataigner.o2switch.net
```

### 2. Créer le dossier backend

```bash
cd /home/wosi9734/nodevenv
mkdir -p backend
cd backend
```

### 3. Cloner le repository GitHub

```bash
# Cloner votre repo
git clone https://github.com/QuentinVrns/tastywall-backend.git .

# Vérifier que les fichiers sont bien là
ls -la
```

### 4. Activer Node.js 22

```bash
source /home/wosi9734/nodevenv/backend/22/bin/activate
```

### 5. Installer les dépendances

```bash
# Installation de toutes les dépendances
npm install

# Générer le client Prisma
npx prisma generate
```

### 6. Créer le fichier .env

**IMPORTANT** : Créez le fichier `.env` avec vos vraies valeurs :

```bash
nano .env
```

Copiez ce contenu (remplacez par VOS valeurs) :

```env
# Database PostgreSQL o2switch
DATABASE_URL="postgresql://wosi9734_USER:MOT_DE_PASSE@localhost:5432/wosi9734_BASE?schema=public&client_encoding=utf8"

# Firebase Admin SDK
FIREBASE_PROJECT_ID="votre-project-id"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVotre_clé_privée_ici\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@votre-project.iam.gserviceaccount.com"

# Server
PORT=3000

# CORS - Vos domaines autorisés
ALLOWED_ORIGINS=https://votre-domaine.com,https://www.votre-domaine.com

# Environment
NODE_ENV=production
```

**Sauvegarder** : `Ctrl + X` → `Y` → `Entrée`

### 7. Builder l'application

```bash
npm run build
```

### 8. Appliquer les migrations de base de données

```bash
npx prisma migrate deploy
```

### 9. Démarrer l'application avec PM2

```bash
# Démarrer
pm2 start ecosystem.config.js

# Sauvegarder la config PM2
pm2 save

# Configurer PM2 au démarrage
pm2 startup
```

### 10. Vérifier que tout fonctionne

```bash
# Voir le statut
pm2 status

# Voir les logs
pm2 logs tastywall-backend --lines 30

# Tester l'API
curl http://localhost:3000
```

---

## 🔄 Déploiement des mises à jour (À chaque modification)

Quand vous modifiez le code et faites un `git push` :

### Sur votre machine locale (Windows)

```bash
# 1. Commiter vos changements
git add .
git commit -m "Description de vos modifications"

# 2. Pusher sur GitHub
git push origin main
```

### Sur le serveur o2switch (SSH)

```bash
# 1. Se connecter
ssh wosi9734@chataigner.o2switch.net

# 2. Aller dans le dossier backend
cd /home/wosi9734/nodevenv/backend

# 3. Activer Node.js 22
source /home/wosi9734/nodevenv/backend/22/bin/activate

# 4. Récupérer les dernières modifications
git pull origin main

# 5. Installer les nouvelles dépendances (si package.json a changé)
npm install

# 6. Régénérer Prisma (si schema.prisma a changé)
npx prisma generate

# 7. Appliquer les migrations (si nouvelles migrations)
npx prisma migrate deploy

# 8. Rebuilder l'application
npm run build

# 9. Redémarrer PM2
pm2 restart tastywall-backend

# 10. Vérifier les logs
pm2 logs tastywall-backend --lines 20
```

---

## 🤖 Script de mise à jour automatique

Pour simplifier, créez un script sur le serveur :

```bash
# Sur le serveur o2switch
nano ~/update-backend.sh
```

Copiez ce contenu :

```bash
#!/bin/bash

echo "🔄 Mise à jour du backend Tastywall..."

cd /home/wosi9734/nodevenv/backend || exit 1

# Activer Node.js 22
source /home/wosi9734/nodevenv/backend/22/bin/activate

# Pull les changements
echo "📥 Récupération des modifications..."
git pull origin main

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Générer Prisma
echo "🔧 Génération du client Prisma..."
npx prisma generate

# Appliquer les migrations
echo "🗄️  Application des migrations..."
npx prisma migrate deploy

# Build
echo "🏗️  Build de l'application..."
npm run build

# Redémarrer PM2
echo "🔄 Redémarrage de l'application..."
pm2 restart tastywall-backend

# Afficher les logs
echo "📊 Logs de l'application :"
pm2 logs tastywall-backend --lines 20 --nostream

echo "✅ Mise à jour terminée !"
```

Rendre le script exécutable :

```bash
chmod +x ~/update-backend.sh
```

### Utilisation du script

À chaque mise à jour, il suffit de :

```bash
ssh wosi9734@chataigner.o2switch.net
~/update-backend.sh
```

---

## 📊 Commandes utiles

### Gestion PM2

```bash
# Voir le statut
pm2 status

# Voir les logs en temps réel
pm2 logs tastywall-backend

# Redémarrer
pm2 restart tastywall-backend

# Arrêter
pm2 stop tastywall-backend

# Démarrer
pm2 start tastywall-backend

# Voir les métriques
pm2 monit
```

### Gestion Git

```bash
# Voir les modifications en attente
git status

# Voir les derniers commits
git log --oneline -5

# Voir les différences
git diff

# Annuler les modifications locales
git reset --hard origin/main
```

### Gestion Base de données

```bash
# Se connecter à PostgreSQL
psql -h localhost -U wosi9734_USER -d wosi9734_BASE

# Voir les migrations appliquées
npx prisma migrate status

# Réinitialiser la base (ATTENTION: supprime toutes les données)
npx prisma migrate reset
```

### Gestion Node.js

```bash
# Activer Node.js 22
source /home/wosi9734/nodevenv/backend/22/bin/activate

# Vérifier la version
node --version
npm --version

# Nettoyer node_modules
rm -rf node_modules
npm install
```

---

## 🆘 Résolution des problèmes

### L'application ne démarre pas

```bash
# Voir les erreurs dans les logs
pm2 logs tastywall-backend --err --lines 50

# Vérifier que le fichier .env existe
cat .env

# Vérifier que le build existe
ls -la dist/
```

### Erreur de connexion base de données

```bash
# Tester la connexion PostgreSQL
psql -h localhost -U wosi9734_USER -d wosi9734_BASE

# Vérifier DATABASE_URL dans .env
cat .env | grep DATABASE_URL
```

### Git pull échoue

```bash
# Voir les changements locaux
git status

# Sauvegarder les changements locaux
git stash

# Pull
git pull origin main

# Réappliquer les changements (si nécessaire)
git stash pop
```

### Port déjà utilisé

```bash
# Trouver le processus sur le port 3000
lsof -i :3000

# Tuer tous les processus PM2
pm2 kill

# Redémarrer
pm2 start ecosystem.config.js
```

### Rebuild complet

```bash
cd /home/wosi9734/nodevenv/backend
source /home/wosi9734/nodevenv/backend/22/bin/activate

# Nettoyer
rm -rf node_modules dist

# Réinstaller
npm install
npx prisma generate
npm run build

# Redémarrer
pm2 restart tastywall-backend
```

---

## 🔒 Sécurité

### Fichiers sensibles (ne JAMAIS commiter sur GitHub)

- ✅ `.env` est dans `.gitignore`
- ✅ Les clés Firebase (`*-firebase-adminsdk-*.json`) sont exclues
- ✅ Les certificats (`*.pem`, `*.key`) sont exclus

### Vérifier avant de pusher

```bash
# Sur votre machine locale
git status

# Vérifier qu'aucun fichier sensible n'est staged
git diff --cached
```

---

## 📈 Monitoring

### Vérifier la santé de l'application

```bash
# CPU et mémoire
pm2 monit

# Logs en temps réel
pm2 logs tastywall-backend --lines 100

# Tester l'API
curl http://localhost:3000
```

### Si besoin de redémarrer automatiquement

PM2 redémarre automatiquement l'app si elle crash. Configuration dans [ecosystem.config.js](ecosystem.config.js) :

```javascript
autorestart: true,
max_memory_restart: '1G',
```

---

## 📞 Support

- Guide rapide : [GUIDE-DEPLOIEMENT-RAPIDE.md](GUIDE-DEPLOIEMENT-RAPIDE.md)
- Documentation NestJS : https://docs.nestjs.com
- Documentation Prisma : https://www.prisma.io/docs
- Documentation PM2 : https://pm2.keymetrics.io

---

**Votre backend est maintenant déployé via GitHub ! 🎉**
