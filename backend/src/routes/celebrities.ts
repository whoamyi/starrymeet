import { Router } from 'express';
import { listCelebrities, getCelebrity, getCelebrityReviews } from '../controllers/celebrityController';

const router = Router();

router.get('/', listCelebrities);
router.get('/:id', getCelebrity);
router.get('/:id/reviews', getCelebrityReviews);

export default router;
