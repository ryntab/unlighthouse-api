import { createUnlighthouse } from "@unlighthouse/core";
import { useUnlighthouseConfig } from "../utils/lighthouse/config.js";
import { useHookHandlers } from "../utils/lighthouse/hookHandler.js";
import { useReduceURL } from "../utils/useReduceURL.js";

import { randomBytes } from "crypto";

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
  hooks.hook(
    "discovered-internal-links",
    workerHandlers.discoveredInternalLinks
  );

  await lighthouse.start();
};

// Function to handle audit start request
export const startAudit = async (req, res) => {
  const { site, pingBack, config, secure } = req.body;

  if (!site) {
    return res
      .status(400)
      .send({ success: false, message: "Site is required" });
  }

  const baseURL = useReduceURL(site);
  const lightHouseConfig = await useUnlighthouseConfig({
    site: baseURL,
    ...config,
  });

  try {

    await runLightHouse({
      site: baseURL,
      config: lightHouseConfig,
      pingBack,
      secure: false,
    });

    let key = secure ? randomBytes(24).toString("hex") : null;
    const response = new Object();

    if (secure) {
      response.key = key;
    }

    response.message = pingBack
      ? "Lighthouse audit started. Your pingback URLs will be updated."
      : "Lighthouse audit started. You can check the audit response by calling /api/audit/:id.";

    res.send({
      success: true,
      ...response,
    });


  } catch (error) {
    console.error("Lighthouse audit error:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};
