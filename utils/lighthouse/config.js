import { defineConfig } from '@unlighthouse/core'

const useUnlighthouseConfig = (config) => {
    const safeConfig = {
        site: config.site || 'https://example.com',
        lighthouseOptions: config.lighthouseOptions || {},
        cache: config.cache || true,
        outputPath: 'audits',
        scanner: {
            device: config.scanner?.device || 'desktop',
            maxRoutes: config.scanner?.maxRoutes || 10,
            maxWorkers: config.scanner?.maxWorkers || 2,
            dynamicSampling: config.scanner?.dynamicSampling || false,
        },
        audit: config.audit || {},
    };

    // Now, pass the safeConfig to defineConfig
    return defineConfig(safeConfig);
}

export { useUnlighthouseConfig }