import express from 'express';
import lighthouseRoutes from './routes/lighthouse.js';
import auditRoutes from './routes/auditRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Use the lighthouse routes for starting audits
app.use('/api/lighthouse', lighthouseRoutes);

// Use the audit routes for reading audits
app.use('/api/audit', auditRoutes);

app.listen(port, () => {
    console.log(`Server Running on port: ${port} 🚀`);
    console.log(`[POST] to /api/lighthouse/audit to start a Unlighthouse report.`);
});
