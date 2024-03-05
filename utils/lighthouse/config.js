import { defineConfig } from '@unlighthouse/core'

const useUnlighthouseConfig = (config) => {
    const safeConfig = {
        site: config.site || 'defaultSiteURL',
        lighthouseOptions: config.lighthouseOptions || {},
        // cache: false,
        outputPath: 'audits',
        scanner: {
            device: config.scanner?.device || 'desktop',
            maxRoutes: config.scanner?.maxRoutes || 10,
            maxWorkers: config.scanner?.maxWorkers || 4,
            dynamicSampling: config.scanner?.dynamicSampling || false,
        },
        audit: config.audit || {},
    };

    // Now, pass the safeConfig to defineConfig
    return defineConfig(safeConfig);
}

export { useUnlighthouseConfig }