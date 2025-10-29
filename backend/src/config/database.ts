import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Neon and other cloud providers often provide DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;

const sslConfig = (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') ? {
  require: true,
  rejectUnauthorized: false // Required for Neon and most cloud databases
} : undefined;

const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: sslConfig,
        statement_timeout: 10000, // 10 second query timeout
        query_timeout: 10000,
        connectionTimeoutMillis: 10000
      },
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 10000, // Reduce from 30s to 10s
        idle: 10000
      }
    })
  : new Sequelize(
      process.env.DB_NAME || 'starrymeet_dev',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        dialect: 'postgres',
        dialectOptions: {
          ssl: sslConfig,
          statement_timeout: 10000,
          query_timeout: 10000,
          connectionTimeoutMillis: 10000
        },
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
          max: 5,
          min: 0,
          acquire: 10000,
          idle: 10000
        }
      }
    );

export default sequelize;
