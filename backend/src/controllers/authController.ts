import { Response } from 'express';
import { User } from '../models';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { sendWelcomeEmail } from '../services/email.service';
import sequelize from '../config/database';
import { QueryTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

// ===================================
// SIGN UP
// ===================================
export const signup = async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      throw new AppError('All fields are required', 400);
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new AppError('Invalid email format', 400);
    }

    // Validate password strength
    if (password.length < 8) {
      throw new AppError('Password must be at least 8 characters', 400);
    }

    // Check if email already exists
    const existingUser = await sequelize.query(
      'SELECT id FROM users WHERE email = ?',
      {
        replacements: [email.toLowerCase()],
        type: QueryTypes.SELECT
      }
    );

    if (existingUser.length > 0) {
      throw new AppError('Email already registered', 400);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate user ID
    const userId = uuidv4();

    // Insert user
    await sequelize.query(
      `INSERT INTO users (id, email, password_hash, first_name, last_name, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      {
        replacements: [userId, email.toLowerCase(), passwordHash, firstName, lastName]
      }
    );

    // Create user profile
    await sequelize.query(
      'INSERT INTO user_profiles (user_id, created_at, updated_at) VALUES (?, NOW(), NOW())',
      { replacements: [userId] }
    );

    // Generate session token
    const token = generateToken({
      userId,
      email: email.toLowerCase(),
      role: 'user'
    });

    // Create session record
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await sequelize.query(
      `INSERT INTO sessions (id, user_id, token, expires_at, ip_address, user_agent, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      {
        replacements: [
          sessionId,
          userId,
          token,
          expiresAt,
          req.ip,
          req.headers['user-agent'] || null
        ]
      }
    );

    // Send welcome email (async, don't wait for it)
    sendWelcomeEmail(email, firstName).catch(err => {
      console.error('Failed to send welcome email:', err);
    });

    // Return user data and session
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      session: {
        token,
        expiresAt
      },
      user: {
        id: userId,
        email: email.toLowerCase(),
        firstName,
        lastName,
        avatar: null
      }
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Failed to create account';
    res.status(statusCode).json({
      success: false,
      error: { message }
    });
  }
};

// ===================================
// SIGN IN
// ===================================
export const signin = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Validate input
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    // Find user
    const users: any[] = await sequelize.query(
      `SELECT id, email, password_hash, first_name, last_name, avatar_url, is_active
       FROM users WHERE email = ?`,
      {
        replacements: [email.toLowerCase()],
        type: QueryTypes.SELECT
      }
    );

    if (users.length === 0) {
      throw new AppError('Invalid email or password', 401);
    }

    const user = users[0];

    // Check if account is active
    if (!user.is_active) {
      throw new AppError('Account has been deactivated', 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate session token
    const expiresIn = rememberMe ? 30 : 7; // days
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: 'user'
    });

    // Create session record
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000);

    await sequelize.query(
      `INSERT INTO sessions (id, user_id, token, expires_at, ip_address, user_agent, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      {
        replacements: [
          sessionId,
          user.id,
          token,
          expiresAt,
          req.ip,
          req.headers['user-agent'] || null
        ]
      }
    );

    // Update last login
    await sequelize.query(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      { replacements: [user.id] }
    );

    // Return user data and session
    res.json({
      success: true,
      message: 'Sign in successful',
      session: {
        token,
        expiresAt
      },
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        avatar: user.avatar_url
      }
    });
  } catch (error: any) {
    console.error('Signin error:', error);
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Failed to sign in';
    res.status(statusCode).json({
      success: false,
      error: { message }
    });
  }
};

// ===================================
// VERIFY SESSION
// ===================================
export const verify = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    // Session is valid if we got here (middleware verified token)
    res.json({
      success: true,
      user: req.user
    });
  } catch (error: any) {
    console.error('Verify error:', error);
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Failed to verify session';
    res.status(statusCode).json({
      success: false,
      error: { message }
    });
  }
};

// ===================================
// SIGN OUT
// ===================================
export const signout = async (req: AuthRequest, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (token) {
      // Delete session
      await sequelize.query(
        'DELETE FROM sessions WHERE token = ?',
        { replacements: [token] }
      );
    }

    res.json({
      success: true,
      message: 'Signed out successfully'
    });
  } catch (error: any) {
    console.error('Signout error:', error);
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Failed to sign out';
    res.status(statusCode).json({
      success: false,
      error: { message }
    });
  }
};

// ===================================
// FORGOT PASSWORD
// ===================================
export const forgotPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError('Email is required', 400);
    }

    // Find user
    const users: any[] = await sequelize.query(
      'SELECT id, email, first_name FROM users WHERE email = ?',
      {
        replacements: [email.toLowerCase()],
        type: QueryTypes.SELECT
      }
    );

    // Always return success (don't reveal if email exists)
    if (users.length === 0) {
      return res.json({
        success: true,
        message: 'If the email exists, a reset link will be sent'
      });
    }

    const user = users[0];

    // Generate reset token
    const resetToken = uuidv4();
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token
    await sequelize.query(
      `UPDATE users
       SET reset_token = ?, reset_token_expires = ?
       WHERE id = ?`,
      { replacements: [resetToken, resetTokenExpires, user.id] }
    );

    // TODO: Send email with reset link
    // await sendPasswordResetEmail(user.email, user.first_name, resetToken);
    console.log(`Password reset link: ${process.env.APP_URL}/reset-password.html?token=${resetToken}`);

    res.json({
      success: true,
      message: 'If the email exists, a reset link will be sent'
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Failed to process password reset';
    res.status(statusCode).json({
      success: false,
      error: { message }
    });
  }
};

// ===================================
// GET ME (for compatibility)
// ===================================
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByPk(req.user!.userId, {
      attributes: ['id', 'email', 'first_name', 'last_name', 'phone', 'avatar_url', 'role', 'email_verified']
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error: any) {
    console.error('Get me error:', error);
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Failed to get user data';
    res.status(statusCode).json({
      success: false,
      error: { message }
    });
  }
};

// Aliases for backward compatibility
export const register = signup;
export const login = signin;
