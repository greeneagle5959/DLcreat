// On importe les modules dont on a besoin
import express from 'express'; // Pour gérer les routes
import path from 'path'; // Pour gérer les chemins de fichiers
import multer from 'multer'; // Pour gérer l'upload de fichiers (genre les avatars)
import { fileURLToPath } from 'url'; // Pour récupérer le chemin du fichier actuel
import * as userController from '../controllers/userController.js'; // On prend toutes les fonctions du contrôleur utilisateur

// On crée le routeur Express (c'est lui qui va gérer toutes les routes de ce fichier)
const router = express.Router();

// Petite astuce pour avoir __dirname en ES modules (sinon ça existe pas)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// On définit où seront stockés les fichiers uploadés (ici, les avatars)
const uploadsDir = path.join(__dirname, '..', 'uploads');

// On configure le stockage des avatars avec multer
const avatarStorage = multer.diskStorage({
	// Où on met le fichier
	destination: (_, __, cb) => cb(null, uploadsDir),
	// Comment on nomme le fichier (timestamp + avatar + nom d'origine)
	filename: (_, file, cb) => {
		const timestamp = Date.now();
		const safeName = file.originalname.replace(/\s+/g, '_');
		cb(null, `${timestamp}_avatar_${safeName}`);
	}
});

// On crée l'instance multer pour gérer l'upload des avatars
const avatarUpload = multer({
	storage: avatarStorage,
	limits: { fileSize: 50 * 1024 * 1024 }, // Limite à 50 Mo (faut pas abuser)
	fileFilter: (_, file, cb) => {
		// On accepte que les images (sinon, erreur)
		if (file.mimetype.startsWith('image')) {
			cb(null, true);
		} else {
			cb(new Error('Seules les images sont autorisées pour l\'avatar'));
		}
	}
});

// ===================== ROUTES ===================== //
// Toutes les routes qui suivent utilisent les fonctions du contrôleur utilisateur
// et certaines sont protégées par le middleware d'authentification (faut être connecté)

// Récupérer tous les utilisateurs (faut être connecté)
router.get('/', userController.authenticateJWT, userController.getAllUsers);
// Récupérer le résumé/stat d'un utilisateur (faut être connecté)
router.get('/:id/summary', userController.authenticateJWT, userController.getUserSummary);
// Récupérer un utilisateur par son id (faut être connecté)
router.get('/:id', userController.authenticateJWT, userController.getUserById);
// Créer un nouvel utilisateur (inscription, pas besoin d'être connecté)
router.post('/', userController.createUser);
// Se connecter (login, pas besoin d'être connecté)
router.post('/auth/login', userController.loginUser);
// Uploader un avatar (faut être connecté, et envoyer un fichier image)
router.post('/:id/avatar', userController.authenticateJWT, avatarUpload.single('avatar'), userController.uploadAvatar);
// Suivre un utilisateur (faut être connecté)
router.post('/follow', userController.authenticateJWT, userController.followUser);
// Se désabonner (faut être connecté)
router.delete('/follow', userController.authenticateJWT, userController.unfollowUser);
// Voir les followers d'un utilisateur (faut être connecté)
router.get('/followers/:id', userController.authenticateJWT, userController.getFollowers);
// Voir qui on suit (faut être connecté)
router.get('/following/:id', userController.authenticateJWT, userController.getFollowing);
// Voir les amis en commun (faut être connecté)
router.get('/mutual/:id/:otherId', userController.authenticateJWT, userController.getMutualFriends);
// Vue d'ensemble admin (faut être connecté)
router.get('/admin/overview', userController.authenticateJWT, userController.getAdminOverview);
// Modifier un utilisateur (faut être connecté)
router.put('/:id', userController.authenticateJWT, userController.updateUser);
// Supprimer un utilisateur (faut être connecté)
router.delete('/:id', userController.authenticateJWT, userController.deleteUser);

// On exporte le routeur pour que le serveur principal puisse l'utiliser
export default router;
