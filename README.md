
# Unlighthouse API

A Node API for Unlighthouse

## Install

To deploy this project locally, clone and run...

```bash
  npm install & npm run start
```

An express server will start on port 8080
## API Reference

### ⚡ Run Audit

To run an Unlighthouse audit with no configurations passed. Send a `POST` request to 
`/api/lighthouse/audit` with the site URL in the `POST` body.

```JSON
[POST] http://localhost:3000/api/lighthouse/audit
{
  "site": "https://www.sfamarketing.com/"
}
```

Configurations can be passed through a config object in the `POST` body and can be used to control crawl limites, device and audit categories.

```JSON
[POST] http://localhost:3000/api/lighthouse/audit
{
  "site": "https://www.sfamarketing.com/",
  "config": {
    "scanner": {
      "maxRoutes": "100"
    }
  }
}
```

Ping back URLs can be used to update your external service on audit progress and to catch results. To run an unlighthouse audit with a pingback to your service

```JSON
[POST] http://localhost:3000/api/lighthouse/audit
{
  "site": "https://www.sfamarketing.com/",
  "pingBack": "http://localhost:3001/pingback",
  "config": {
    "scanner": {
      "maxRoutes": "100"
    }
  }
}
```

You can use a generic pingback url to handle all hook events. Or you can pass an object of urls to handle each hook event individually.

```JSON
[POST] http://localhost:3000/api/lighthouse/audit
{
  "site": "https://www.sfamarketing.com/",
  "pingBack": {
      "task_added":".../webhook/task_added/"
      "task_started":".../webhook/task_ctarted/"
      "task_complete":".../webhook/task_complete/"
      "worker_finished":".../webhook/worker_finished/"
      "discovered_internal_links":".../webhook/discovered_internal_links/"
  }
  "config": {
    "scanner": {
      "maxRoutes": "100"
    }
  }
}
```



