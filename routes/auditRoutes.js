import express from 'express';
import { getAuditFolders, getAuditDetails, getReportTree, getSiteTree } from '../handlers/auditReader.js';
import { useReduceURL } from '../utils/useReduceURL.js';

const router = express.Router();

router.get('/list', async (req, res) => {
    const { site } = req.query;

    if (!site) {
        return res.status(400).send('Site is required');
    }

    try {
        const { domainFolderPath, auditFolders } = getAuditFolders(site);
        const audits = auditFolders.map(folder => {
            const auditDetails = getAuditDetails(domainFolderPath, folder);
            return {
                audit: folder,
                details: auditDetails,
            };
        });

        res.send({ domain: useReduceURL(site), audits });
    } catch (error) {
        console.error('Error reading audit folders:', error.message);
        if (error.message === 'No audit found') {
            res.status(404).send(error.message);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
});

router.get('/report-tree', async (req, res) => {
    const { site, audit } = req.query;

    if (!site || !audit) {
        return res.status(400).send('Site and audit are required');
    }

    try {
        const reportTree = getReportTree(site, audit);
        res.send(reportTree);
    } catch (error) {
        console.error('Error reading report tree:', error.message);
        if (error.message === 'Audit not found') {
            res.status(404).send(error.message);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
});

router.get('/site-tree', async (req, res) => {
    const { site } = req.query;

    if (!site) {
        return res.status(400).send('Site is required');
    }

    try {
        const siteTree = getSiteTree(site);
        res.send(siteTree);
    } catch (error) {
        console.error('Error reading site tree:', error.message);
        if (error.message === 'Site not found') {
            res.status(404).send(error.message);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
});

export default router;
