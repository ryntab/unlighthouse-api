import express from 'express';
import { startAudit } from '../handlers/lighthouse.js';

const router = express.Router();

router.post('/audit', startAudit);

export default router;
