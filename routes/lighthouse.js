import express from 'express';
import { startAudit, listAudits } from '../handlers/lighthouse.js';

const router = express.Router();

const ROUTE_AUDIT = '/lighthouse/audit';

router.post(`${ROUTE_AUDIT}`, startAudit);
router.get(`${ROUTE_AUDIT}/list`, listAudits);

export default router;
