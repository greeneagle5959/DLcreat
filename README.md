# DLCreat

Projet complet React + Node.js (Express) + MySQL

## Structure du projet

- `src/` : Frontend React (Vite)
- `backend/` : Backend Node.js/Express (API, sécurité, JWT, etc.)
- `public/` : Fichiers statiques
- `dist/` : Build de production (frontend)

## Lancer le projet en local

### 1. Installer les dépendances

```bash
cd backend
npm install
cd ..
npm install
```

### 2. Configurer les variables d'environnement

- Copier `backend/.env` et adapter les infos (voir aussi `.env.example` pour le front)

### 3. Lancer le backend

```bash
cd backend
npm run dev
```

### 4. Lancer le frontend

```bash
npm run dev
```

## Déploiement sur GitHub

- Ne jamais commit le dossier `node_modules`, les fichiers `.env` ou les données sensibles.
- Le `.gitignore` est déjà configuré pour ignorer ce qu'il faut.
- Pousse ton code sur GitHub avec :

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

## Conseils sécurité

- Change le `JWT_SECRET` dans le `.env` backend avant la prod !
- Utilise des mots de passe forts pour la base de données.
- Mets à jour les dépendances régulièrement.

---

Projet prêt à évoluer comme un vrai réseau social (Instagram/Facebook) !
