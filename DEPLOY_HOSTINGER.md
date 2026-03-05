# Deploy Hostinger (Node.js VPS)

## 1) Copier le projet sur le VPS

```bash
cd /var/www
git clone https://github.com/gabriel429/drnoflu.git
cd drnoflu
```

## 2) Configurer les variables d'environnement

Creer un fichier `.env` dans `/var/www/drnoflu`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=...
NEXT_PUBLIC_CLOUDINARY_API_KEY=...
NEXT_PUBLIC_SITE_URL=https://ton-domaine.tld
NEXT_PUBLIC_MAPBOX_TOKEN=...
```

## 3) Installer et demarrer l'application

```bash
cd /var/www/drnoflu
npm ci
npm run build
npm i -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

## 4) Configurer Nginx

1. Copier `nginx/drnoflu.conf` vers `/etc/nginx/sites-available/drnoflu.conf`
2. Remplacer `ton-domaine.tld` par ton vrai domaine
3. Cette config redirige automatiquement `www` vers le domaine principal
4. Cette config applique un cache long pour les assets statiques (`/_next/static`)
5. Activer le site et recharger Nginx:

```bash
ln -s /etc/nginx/sites-available/drnoflu.conf /etc/nginx/sites-enabled/drnoflu.conf
nginx -t
systemctl reload nginx
```

## 5) Ajouter HTTPS (Let's Encrypt)

```bash
apt update
apt install certbot python3-certbot-nginx -y
certbot --nginx -d ton-domaine.tld -d www.ton-domaine.tld
```

## 6) Deploiements suivants

A chaque mise a jour:

```bash
cd /var/www/drnoflu
chmod +x deploy.sh
./deploy.sh
```

## 7) Depannage: Build failed

Si tu vois une erreur comme:

```text
@supabase/ssr: Your project's URL and API key are required
```

alors les variables `.env` ne sont pas renseignees correctement sur le VPS.

Verification rapide:

```bash
cd /var/www/drnoflu
cat .env
```

Ensuite relancer:

```bash
./deploy.sh
```
