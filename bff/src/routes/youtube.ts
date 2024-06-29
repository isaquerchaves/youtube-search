import { Router } from 'express';
import { searchVideos } from '../controllers/youtubeController';

const router = Router();

router.get('/search', searchVideos);

export default router;
