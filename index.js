import { createUnlighthouse } from '@unlighthouse/core'
import { useUnlighthouseConfig } from './utils/lighthouse/config.js'
import { useHookHandlers } from './utils/lighthouse/hookHandler.js'
import { useReduceURL } from './utils/useReduceURL.js'

import fs from 'fs'
import path from 'path'

import express from 'express'

const app = express()

const port = 3000

const config = await useUnlighthouseConfig({
    site: 'https://www.sfamarketing.com/',
})

const runLightHouse = async ({ site, config }) => {
    const lighthouse = await createUnlighthouse(config, {
        name: 'custom',
        routeDefinitions: () => () => {
            return []
        }
    })

    const { taskHandlers, workerHandlers } = useHookHandlers(config);
    const { hooks } = lighthouse

    // Register task-related hooks
    hooks.hook('task-added', taskHandlers.added);
    hooks.hook('task-started', taskHandlers.started);
    hooks.hook('task-complete', taskHandlers.complete);
    hooks.hook('worker-finished', workerHandlers.finished);
    hooks.hook('discovered-internal-links', workerHandlers.discoveredInternalLinks);

    await lighthouse.start()
}

const getLightHouseResults = async ({ site }) => {


}

app.use(express.json());

app.listen(port)

app.post('/api/lighthouse/audit', async (req, res) => {
    const body = req.body
    const { site } = body

    if (!site) {
        return res.status(400).send('Site is required')
    }

    const baseURL = useReduceURL(site)

    try {
        await runLightHouse({ baseURL, config })
        res.send('Lighthouse audit started')
    } catch (error) {
        res.status(500).send
    }
})

app.get('/api/lighthouse/audit', async (req, res) => {
    const params = req.query
    const { site } = params

    const baseURL = useReduceURL(site)

    if (!site) {
        return res.status(400).send('Site is required')
    }

    // Try to find folder with site name
    const folderPath = `./audits/${baseURL}`
    console.log(folderPath)
    const folderExists = fs.existsSync

    if (!folderExists) {
        return res.status(404).send('No audit found')
    }

    const files = fs.readdirSync(folderPath);
    const results = files.map((file) => {
        const filePath = path.join(folderPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) { // Check if the path is indeed a file
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } else {
            return null; // Or handle directories differently
        }
    }).filter(Boolean); // Filter out null values (directories in this case)

    res.send(results);


})

// test()