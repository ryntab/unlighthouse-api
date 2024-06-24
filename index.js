import express from 'express';
import lighthouseRoutes from './routes/lighthouse.js';
import auditRoutes from './routes/auditRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Use the lighthouse routes for starting audits
app.use('/api/', lighthouseRoutes);

// Use the audit routes for reading audits
app.use('/api/', auditRoutes);

app.listen(port, () => {
    console.log(`Server Running on port: ${port} 🚀`);
    console.log(`[POST] to /api/lighthouse/audit to start a Unlighthouse report.`);
});

const test_hook_server = express();
const test_hook_port = 3001;

test_hook_server.use(express.json());

test_hook_server.post('/pingback', (req, res) => {
    console.log('Pingback received:', req.body);
    res.send({ success: true });
});

test_hook_server.listen(test_hook_port, () => {
    console.log(`Test Hook Server Running on port: ${test_hook_port} 🚀`);
});




