import fs from 'fs';
import path from 'path';
import { createUnlighthouse } from '@unlighthouse/core';
import { useUnlighthouseConfig } from '../utils/lighthouse/config.js';
import { useHookHandlers } from '../utils/lighthouse/hookHandler.js';
import { useReduceURL } from '../utils/useReduceURL.js';

export const runLightHouse = async ({ site, config }) => {
    const lighthouse = await createUnlighthouse(config, {
        name: 'custom',
        routeDefinitions: () => () => [],
    });

    const { taskHandlers, workerHandlers } = useHookHandlers(config);
    const { hooks } = lighthouse;

    // Register task-related hooks
    hooks.hook('task-added', taskHandlers.added);
    hooks.hook('task-started', taskHandlers.started);
    hooks.hook('task-complete', taskHandlers.complete);
    hooks.hook('worker-finished', workerHandlers.finished);
    hooks.hook('discovered-internal-links', workerHandlers.discoveredInternalLinks);

    await lighthouse.start();
};

export const startAudit = async (req, res) => {
    const { site } = req.body;

    if (!site) {
        return res.status(400).send('Site is required');
    }

    const baseURL = useReduceURL(site);
    const config = await useUnlighthouseConfig({ site: baseURL });

    try {
        await runLightHouse({ site: baseURL, config });
        res.send('Lighthouse audit started');
    } catch (error) {
        console.error('Lighthouse audit error:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const listAudits = async (req, res) => {
    const { site } = req.query;

    if (!site) {
        return res.status(400).send('Site is required');
    }

    const baseURL = useReduceURL(site);
    const domainFolderPath = path.join(__dirname, '..', 'audits', baseURL);

    if (!fs.existsSync(domainFolderPath)) {
        return res.status(404).send('No audit found');
    }

    try {
        const auditFolders = fs.readdirSync(domainFolderPath).filter(file => {
            return fs.statSync(path.join(domainFolderPath, file)).isDirectory();
        });

        const audits = auditFolders.map(folder => {
            const folderPath = path.join(domainFolderPath, folder);
            const files = fs.readdirSync(folderPath);

            const auditDetails = files.map(file => {
                const filePath = path.join(folderPath, file);
                const stats = fs.statSync(filePath);
                if (stats.isFile()) {
                    return {
                        file,
                        size: stats.size,
                        createdAt: stats.birthtime,
                    };
                }
                return null;
            }).filter(Boolean); // Filter out null values

            return {
                audit: folder,
                details: auditDetails,
            };
        });

        res.send({ domain: baseURL, audits });
    } catch (error) {
        console.error('Error reading audit folders:', error);
        res.status(500).send('Internal Server Error');
    }
};
