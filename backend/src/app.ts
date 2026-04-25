import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { prisma } from './config/prisma';
import router from './routes';
import { notFoundHandler } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';
import { ensureAdminBootstrap } from './services/authService';
import rateLimit from 'express-rate-limit';
import { successResponse } from './utils/apiResponse';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { success: false, message: 'Too many requests from this IP, please try again later.', errors: {} }
});

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true
}));
app.use(limiter);
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/health', (req, res) => {
    res.json(successResponse('Success', {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'FloyMedia API'
    }));
});

// API routes
app.use('/', router);

app.use(notFoundHandler);
app.use(errorHandler);

// Database connection and server start
async function startServer() {
    try {
        await prisma.$connect();
        console.log('Database connection established successfully.');
        await ensureAdminBootstrap();
        app.listen(PORT, () => {
          console.log(`FloyMedia API running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

startServer();

export default app;