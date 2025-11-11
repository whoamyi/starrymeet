import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

/**
 * Middleware to require admin role
 * Must be used after the authenticate middleware
 */
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: { message: 'Authentication required' }
    });
  }

  // Check if user has admin role
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: { message: 'Admin access required' }
    });
  }

  next();
};

/**
 * Middleware to require celebrity access for specific celebrity profile
 * For future use with granular permissions (currently all admins have access to all celebrities)
 *
 * @param celebrityIdParam - The request parameter name containing the celebrity ID (default: 'celebrityId')
 */
export const requireCelebrityAccess = (celebrityIdParam: string = 'celebrityId') => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required' }
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Admin access required' }
      });
    }

    // Get celebrity ID from params, query, or body
    const celebrityId = req.params[celebrityIdParam] ||
                       req.query[celebrityIdParam] ||
                       (req.body && req.body.celebrity_id);

    if (!celebrityId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Celebrity ID required' }
      });
    }

    // TODO: In future, check admin_celebrity_access table for granular permissions
    // For now, all admins have access to all celebrities

    // Attach celebrity ID to request for use in controller
    (req as any).celebrityId = celebrityId;

    next();
  };
};

/**
 * Middleware to check if user is either admin or the user themselves
 * Useful for endpoints that can be accessed by both admins and regular users for their own data
 */
export const requireAdminOrSelf = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: { message: 'Authentication required' }
    });
  }

  const targetUserId = req.params.userId || req.query.userId || req.body.user_id;
  const currentUserId = req.user.userId || req.user.id;

  // Allow if admin OR if accessing own data
  if (req.user.role === 'admin' || currentUserId === targetUserId) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: { message: 'Access denied' }
    });
  }
};
