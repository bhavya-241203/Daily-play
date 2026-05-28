import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { setupWebhook } from './webhook';
import { setupScheduler } from './scheduler';

const app = express();
const PORT = process.env.PORT || 3000;

setupWebhook(app);
setupScheduler();

app.get('/health', (_, res) => {
  res.json({ status: 'ok', service: 'Daily Play WhatsApp Bot' });
});

app.listen(PORT, () => {
  console.log(`Daily Play WhatsApp Bot running on port ${PORT}`);
  console.log(`Webhook: POST http://localhost:${PORT}/webhook`);
  console.log(`Health:  GET  http://localhost:${PORT}/health`);
});
