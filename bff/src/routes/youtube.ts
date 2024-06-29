import { Router } from 'express';
import { searchVideos, getVideoById, addToFavorites, removeFromFavorites, getAllFavorites } from '../controllers/youtubeController';

const router = Router();

router.get('/search', searchVideos);
router.get('/search/:videoId', getVideoById);
router.post('/favorites/add', addToFavorites);
router.delete('/favorites/remove/:videoId', removeFromFavorites);
router.get('/favorites/all', getAllFavorites);

export default router;