import { createUnlighthouse, defineConfig } from '@unlighthouse/core'

// Define your configuration
const config = defineConfig({
    site: 'https://www.sfamarketing.com/', // Replace with your target site URL
    lighthouseOptions: {
        onlyCategories: ['seo'],
        device: 'desktop',
        
        // Lighthouse options
    },
    output: 'lighthouse-results', // Output directory
    device: 'desktop',
    audit: {
        // Lighthouse audit options
        onlyCategories: ['seo'],
    },
    // Lighthouse flags
    flags: {
        // Lighthouse flags
    },
    // Lighthouse settings
    settings: {
        // Lighthouse settings
    },
    // Lighthouse plugins
    plugins: {
        // Lighthouse plugins
    },
    // Lighthouse assertions
    assertions: {
        // Lighthouse assertions
    },
    // Lighthouse assertions
});

const generateRouteDefinitions = () => {
    return [
        'https://www.sfamarketing.com/',
        'https://www.sfamarketing.com/about/',
        'https://www.sfamarketing.com/services/',
    ]
}

const test = async () => {
    const lighthouse = await createUnlighthouse(config, {
        name: 'custom',
        // some custom implementation to find the route definitions
        routeDefinitions: () => generateRouteDefinitions(),
    })

    const { hooks } = lighthouse


    hooks.hook('task-complete', (path, response) => {
        console.log(response)
    })

    hooks.hook('worker-finished', () => {
        console.log('all done :)')
    })

    await lighthouse.start()
}


test()