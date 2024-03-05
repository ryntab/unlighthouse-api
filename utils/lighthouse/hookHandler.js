const useHookHandlers = (config) => {
    const taskHandlers = {
        added: (path, response) => {
            console.log(path, response)
        },
        started: (path, response) => {
            console.log(path, response)
        },
        complete: (path, response) => {
            console.log(response)
        },
    }

    const workerHandlers = {
        finished: () => {
            console.log('all done :)')
        },
        discoveredInternalLinks: (path, response) => {
            console.log(path, response)
        }
    }

    return {
        taskHandlers,
        workerHandlers
    }
}

export { useHookHandlers }