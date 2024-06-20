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
