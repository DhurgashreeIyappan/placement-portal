/**
 * Express application - routes and middleware only.
 * DB connection and server listen are in server.js.
 */
import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

import analyticsRoutes from './routes/analyticsRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import authRoutes from './routes/authRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import interviewRoundRoutes from './routes/interviewRoundRoutes.js';
import placementRoutes from './routes/placementRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

const app = express();

app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json());

app.get('/', (req, res) => {
	res.send('🚀 Placement Backend API is running successfully');
});

app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/interview-rounds', interviewRoundRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/placements', placementRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

export default app;
