import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import sequelize from './config/database';
import { errorHandler } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/auth';
import celebrityProfileRoutes from './routes/celebrityProfiles';
import bookingRoutes from './routes/bookings';
import paymentRoutes from './routes/payments';
import categoryRoutes from './routes/categories';
import dashboardRoutes from './routes/dashboard';

// Import models to ensure they're loaded
import './models';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration - allow multiple origins
const allowedOrigins = [
  'http://localhost:5500',
  'http://localhost:3001',
  'http://127.0.0.1:5500',
  'https://whoamyi.github.io',
  process.env.FRONTEND_URL || ''
].filter(origin => origin !== '');

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Stripe webhook needs raw body
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// JSON parsing for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging - use combined format in production
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Health check - independent of database connection
app.get('/health', async (req: Request, res: Response) => {
  let dbStatus = 'unknown';

  try {
    // Test database connection with 5 second timeout
    await Promise.race([
      sequelize.authenticate(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
    ]);
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = error instanceof Error && error.message === 'timeout' ? 'timeout' : 'disconnected';
  }

  res.json({
    success: true,
    message: 'StarryMeet API is running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/celebrity-profiles', celebrityProfileRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/payments', paymentRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: { message: 'Route not found' }
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Start server first (non-blocking)
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API: http://localhost:${PORT}`);
      console.log(`🔗 Health: http://localhost:${PORT}/health`);
    });

    // Test database connection (non-blocking)
    try {
      await sequelize.authenticate();
      console.log('✅ Database connection established');

      // Sync models in development (use migrations in production)
      if (process.env.NODE_ENV === 'development') {
        await sequelize.sync({ alter: true });
        console.log('✅ Database models synchronized');
      }
    } catch (dbError) {
      console.error('⚠️  Database connection failed:', dbError);
      console.log('⚠️  Server running but database unavailable');
    }
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
