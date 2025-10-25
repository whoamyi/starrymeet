/**
 * Legacy Celebrity Routes (DEPRECATED)
 *
 * These routes used the old 'celebrities' table which has been removed.
 * All celebrity endpoints now use /api/celebrity-profiles
 *
 * This file is kept for reference but routes are disabled.
 */

import { Router } from 'express';

const router = Router();

// Legacy routes disabled - use /api/celebrity-profiles instead
// Kept for backwards compatibility - returns 410 Gone

router.all('*', (req, res) => {
  res.status(410).json({
    success: false,
    error: {
      message: 'This endpoint has been deprecated. Please use /api/celebrity-profiles instead.',
      code: 'ENDPOINT_DEPRECATED'
    }
  });
});

export default router;
