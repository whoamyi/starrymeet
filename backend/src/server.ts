import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import sequelize from './config/database';
import { errorHandler } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/auth';
import celebrityRoutes from './routes/celebrities';
import celebrityProfileRoutes from './routes/celebrityProfiles';
import bookingRoutes from './routes/bookings';
import paymentRoutes from './routes/payments';

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

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5500',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Stripe webhook needs raw body
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// JSON parsing for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging - use combined format in production
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'StarryMeet API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/celebrities', celebrityRoutes);
app.use('/api/celebrity-profiles', celebrityProfileRoutes);
app.use('/api/bookings', bookingRoutes);
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
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Sync models in development (use migrations in production)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synchronized');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API: http://localhost:${PORT}`);
      console.log(`🔗 Health: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
