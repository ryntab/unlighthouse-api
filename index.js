import express from 'express';
import lighthouseRoutes from './routes/lighthouse.js';
import auditRoutes from './routes/auditRoutes.js';
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();


import { getDirname } from './utils/getDirname.js';
import fs from 'fs';
import path from 'path';

const __dirname = getDirname(import.meta.url);


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors())

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/audits', express.static(path.join(__dirname, 'audits')));

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
    // const body = req.body;
    // const { data } = body;
    // const { response } = data;
    // const { seo } = response;

    // console.log(response)
    res.send({ success: true });
});

test_hook_server.listen(test_hook_port, () => {
    console.log(`Test Hook Server Running on port: ${test_hook_port} 🚀`);
});

app.get('/view-audits', (req, res) => {
    const auditsPath = path.join(__dirname, '/', 'audits')
    console.log(auditsPath)
    fs.readdir(auditsPath, (err, sites) => {
        if (err) {
          return res.status(500).send('Error reading audits directory');
        }
    
        const audits = sites.map(site => {
          const sitePath = path.join(auditsPath, site);
          const auditDirs = fs.readdirSync(sitePath).filter(file => fs.lstatSync(path.join(sitePath, file)).isDirectory());
          const reports = auditDirs.map(auditId => {
            const reportsPath = path.join(sitePath, auditId, 'reports');
            const reportFiles = fs.existsSync(reportsPath) ? fs.readdirSync(reportsPath).filter(file => file.endsWith('.html')) : [];
            return { auditId, reportFiles };
          });
    
          return { site, reports };
        });
    
        res.render('viewAudits', { audits });
      });
});


