// utils/lighthouse/hookHandler.js
import axios from "axios";

const useHookHandlers = ({ config, pingBack, site }) => {
  const notifyPingBackURL = async (url, event, data) => {
    if (url) {
      try {
        await axios.post(url, { site, url, event, data });
      } catch (error) {
        console.error(`Error notifying pingback URL ${url}:`, error);
      }
    }
  };

  const getPingBackURL = (event) => {
    if (typeof pingBack === "string") {
      return pingBack;
    } else if (typeof pingBack === "object") {
      return pingBack[event] || null;
    }
    return null;
  };

  const taskHandlers = {
    added: (path, response) => {
      // console.log('task added', path, response)
      notifyPingBackURL(getPingBackURL("task_added"), "task-added", {
        site,
        path,
        response,
      });
    },
    started: (path, response) => {
      // console.log('task started', path, response)
      notifyPingBackURL(getPingBackURL("task_started"), "task-started", {
        site,
        path,
        response,
      });
    },
    complete: (path, response) => {
      // console.log('task complete', path, response)
      notifyPingBackURL(getPingBackURL("task_complete"), "task-complete", {
        site,
        path,
        response,
      });
    },
  };

  const workerHandlers = {
    finished: () => {
      notifyPingBackURL(getPingBackURL("worker_finished"), "worker-finished");
    },
    discoveredInternalLinks: (path, response) => {
      notifyPingBackURL(
        getPingBackURL("discovered_internal_links"),
        "discovered-internal-links",
        {
          path,
          response,
        }
      );
    },
  };

  return {
    taskHandlers,
    workerHandlers,
  };
};

export { useHookHandlers };
