import { Sequelize } from 'sequelize';
import { config } from './env';
import { initUserModel, User } from '../models/User';
import { initLoginHistoryModel, LoginHistory } from '../models/LoginHistory';

/**
 * Sequelize instance
 */
export const sequelize = new Sequelize({
  database: config.database.name,
  dialect: 'postgres',
  username: config.database.user,
  password: config.database.password,
  host: config.database.host,
  port: config.database.port,
  logging: config.nodeEnv === 'development' ? console.log : false,
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Initialize models
initUserModel(sequelize);
initLoginHistoryModel(sequelize);

// Set up associations
const models = {
  User,
  LoginHistory,
};

Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models);
  }
});

/**
 * Test database connection
 */
export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

/**
 * Close database connection
 */
export const closeDatabase = async (): Promise<void> => {
  await sequelize.close();
  console.log('Database connection closed');
};
