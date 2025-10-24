import { Router } from 'express';
import {
  listCelebrities,
  getCelebrity,
  getCelebrityByUsername,
  getCelebrityReviews,
  getCelebrityAvailability
} from '../controllers/celebrityController';

const router = Router();

router.get('/', listCelebrities);
router.get('/username/:username', getCelebrityByUsername);
router.get('/:id', getCelebrity);
router.get('/:id/reviews', getCelebrityReviews);
router.get('/:id/availability', getCelebrityAvailability);

export default router;
