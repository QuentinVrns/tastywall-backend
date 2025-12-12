# 🚀 Guide de Déploiement sur o2switch

Ce guide vous accompagne pour déployer votre backend Tastywall sur l'hébergeur o2switch.

## 📋 Prérequis

- Un compte o2switch avec accès SSH
- Une base de données PostgreSQL créée sur o2switch
- Node.js installé sur le serveur o2switch (vérifier via cPanel)
- Git installé (optionnel mais recommandé)

## 🔧 Étapes de déploiement

### 1. Préparer les informations de connexion

Depuis votre panel o2switch, récupérez :
- **Hostname PostgreSQL** (généralement `localhost` ou une IP)
- **Nom d'utilisateur** de la base de données
- **Mot de passe** de la base de données
- **Nom de la base de données**
- **Port PostgreSQL** (généralement `5432`)

### 2. Configurer Firebase

Depuis votre console Firebase (https://console.firebase.google.com) :
1. Allez dans **Paramètres du projet** → **Comptes de service**
2. Récupérez :
   - Project ID
   - Private Key
   - Client Email

### 3. Uploader les fichiers

**Option A : Via Git (recommandé)**
```bash
# Sur le serveur o2switch (connexion SSH)
ssh votre_user@votre_serveur.o2switch.net

# Cloner le repository
cd ~/public_html/api  # ou le dossier de votre choix
git clone https://github.com/votre-username/tastywall-backend.git .
```

**Option B : Via FTP/SFTP**
- Uploader tous les fichiers du projet
- **NE PAS uploader** le dossier `node_modules/`
- **NE PAS uploader** le dossier `dist/`

### 4. Créer le fichier .env sur le serveur

```bash
# Se connecter en SSH
ssh votre_user@votre_serveur.o2switch.net

# Aller dans le dossier du projet
cd ~/public_html/api/tastywall-backend

# Créer le fichier .env
nano .env
```

Copier le contenu de `.env.production` et remplacer avec vos vraies valeurs :

```env
# Database PostgreSQL o2switch
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/NOM_BASE?schema=public&client_encoding=utf8"

# Firebase Admin SDK
FIREBASE_PROJECT_ID="votre-project-id"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVotre clé privée complète\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@votre-project.iam.gserviceaccount.com"

# Server
PORT=3000

# CORS - Allowed origins
ALLOWED_ORIGINS=https://votre-domaine.com,https://www.votre-domaine.com

# Environment
NODE_ENV=production
```

**Important** : Pour `FIREBASE_PRIVATE_KEY`, gardez les `\n` pour les retours à la ligne.

Sauvegarder avec `Ctrl + X`, puis `Y`, puis `Entrée`.

### 5. Exécuter le script de déploiement

```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Exécuter le déploiement
./deploy.sh
```

Le script va automatiquement :
- ✅ Installer les dépendances
- ✅ Builder l'application
- ✅ Générer le client Prisma
- ✅ Appliquer les migrations de base de données
- ✅ Démarrer l'application avec PM2

### 6. Configurer le domaine

#### Via cPanel o2switch

1. **Sous-domaine** : Créez un sous-domaine (ex: `api.votre-domaine.com`)
2. **Pointer vers** : Le dossier contenant votre application
3. **SSL** : Activer Let's Encrypt pour HTTPS

#### Fichier .htaccess

Le fichier `.htaccess` est déjà créé et configure le reverse proxy vers Node.js.

### 7. Vérifier que tout fonctionne

```bash
# Voir le status de l'application
pm2 status

# Voir les logs en temps réel
pm2 logs tastywall-backend

# Tester l'API
curl http://localhost:3000
```

Depuis votre navigateur :
```
https://api.votre-domaine.com
```

## 🔄 Mettre à jour l'application

Quand vous modifiez le code :

```bash
# Sur votre machine locale
git add .
git commit -m "Description des changements"
git push

# Sur le serveur o2switch (SSH)
cd ~/public_html/api/tastywall-backend
git pull
./deploy.sh
```

## 📊 Commandes utiles

### PM2 (Gestionnaire de processus)

```bash
# Voir le status
pm2 status

# Voir les logs
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

### Prisma (Base de données)

```bash
# Créer une nouvelle migration
npx prisma migrate dev --name nom_migration

# Appliquer les migrations en production
npx prisma migrate deploy

# Voir les données (Prisma Studio)
npx prisma studio
```

### Logs

```bash
# Logs PM2
pm2 logs

# Logs d'erreur uniquement
pm2 logs --err

# Dernières 100 lignes
pm2 logs --lines 100
```

## 🛠️ Dépannage

### L'application ne démarre pas

```bash
# Vérifier les logs
pm2 logs tastywall-backend --lines 50

# Vérifier que le port n'est pas déjà utilisé
lsof -i :3000

# Redémarrer complètement
pm2 delete tastywall-backend
pm2 start ecosystem.config.js
```

### Erreur de connexion à la base de données

- Vérifier que PostgreSQL est bien installé et démarré
- Vérifier les identifiants dans le fichier `.env`
- Tester la connexion : `psql -h localhost -U user -d base`

### Erreur CORS

- Vérifier que `ALLOWED_ORIGINS` dans `.env` contient vos domaines
- Vérifier que les domaines sont en HTTPS en production

### PM2 ne se lance pas au redémarrage

```bash
# Configurer le démarrage automatique
pm2 startup
pm2 save
```

## 📁 Structure des fichiers sur le serveur

```
~/public_html/api/tastywall-backend/
├── src/                    # Code source
├── dist/                   # Application compilée
├── prisma/                 # Schéma et migrations
├── node_modules/           # Dépendances
├── logs/                   # Logs PM2
├── .env                    # Variables d'environnement (À CRÉER)
├── .htaccess              # Configuration Apache
├── ecosystem.config.js    # Configuration PM2
├── deploy.sh              # Script de déploiement
└── package.json           # Dépendances Node.js
```

## 🔒 Sécurité

- ✅ Le fichier `.env` n'est jamais versionné
- ✅ HTTPS activé via Let's Encrypt
- ✅ CORS configuré pour vos domaines uniquement
- ✅ Headers de sécurité dans `.htaccess`
- ✅ Firebase Admin SDK pour l'authentification

## 📞 Support

- Documentation NestJS : https://docs.nestjs.com
- Documentation Prisma : https://www.prisma.io/docs
- Documentation PM2 : https://pm2.keymetrics.io/docs
- Support o2switch : https://www.o2switch.fr/support

---

**Bon déploiement ! 🚀**
