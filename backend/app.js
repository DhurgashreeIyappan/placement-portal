/**
 * Express application - routes and middleware only.
 * DB connection and server listen are in server.js.
 */
import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import interviewRoundRoutes from './routes/interviewRoundRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import placementRoutes from './routes/placementRoutes.js';

const app = express();

app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json());

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
