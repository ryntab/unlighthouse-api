import express from 'express';
import lighthouseRoutes from './routes/lighthouse.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Use the lighthouse routes
app.use('/api', lighthouseRoutes);

app.listen(port, () => {
    console.log(`Server Running on port: ${port} 🚀`);
    console.log(`[POST] to /api/lighthouse/audit to start a Unlighthouse report.`);
});
