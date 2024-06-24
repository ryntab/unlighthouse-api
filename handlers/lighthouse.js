import { createUnlighthouse } from "@unlighthouse/core";
import { useUnlighthouseConfig } from "../utils/lighthouse/config.js";
import { useHookHandlers } from "../utils/lighthouse/hookHandler.js";
import { useReduceURL } from "../utils/useReduceURL.js";

export const runLightHouse = async ({ site, config, pingBack }) => {
    const lighthouse = await createUnlighthouse(config, {
        name: "custom",
        routeDefinitions: () => () => [],
    });

    const { taskHandlers, workerHandlers } = useHookHandlers({
        config,
        pingBack,
        site,
    });
    const { hooks } = lighthouse;

    // Register task-related hooks
    hooks.hook("task-added", taskHandlers.added);
    hooks.hook("task-started", taskHandlers.started);
    hooks.hook("task-complete", taskHandlers.complete);
    hooks.hook("worker-finished", workerHandlers.finished);
    hooks.hook('discovered-internal-links', workerHandlers.discoveredInternalLinks);

    await lighthouse.start();
};

// Function to handle audit start request
export const startAudit = async (req, res) => {
    const { site, pingBack } = req.body;

    if (!site) {
        return res
            .status(400)
            .send({ success: false, message: "Site is required" });
    }

    const baseURL = useReduceURL(site);
    const config = await useUnlighthouseConfig({ site: baseURL });

    try {
        await runLightHouse({ site: baseURL, config, pingBack });
        res.send({
            success: true,
            message: pingBack
                ? "Lighthouse audit started. Your audit response will be sent to the provided URL."
                : "Lighthouse audit started. You can check the audit response by calling /api/audit/:id.",
        });
    } catch (error) {
        console.error("Lighthouse audit error:", error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
};
