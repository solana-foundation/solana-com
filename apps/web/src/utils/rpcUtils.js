import getNextRequestId from "./getNextRequestId.js";

/**
 * Sends an RPC request to a Solana RPC node.
 *
 * @param rpcNodeURL
 * @param method
 * @param params
 * @returns {Promise<any>}
 */

const isDevelopment =
  typeof window !== "undefined" && window.location.hostname === "localhost";

// Limit the number of concurrent requests
class RequestQueue {
  constructor(maxConcurrentRequests) {
    this.queue = [];
    this.concurrentRequests = 0;
    this.maxConcurrentRequests = maxConcurrentRequests;
  }

  add(request) {
    this.queue.push(() =>
      request().finally(() => {
        this.concurrentRequests--;
        this.next();
      }),
    );
    this.next();
  }

  next() {
    if (
      this.concurrentRequests < this.maxConcurrentRequests &&
      this.queue.length > 0
    ) {
      const request = this.queue.shift();
      this.concurrentRequests++;
      request();
    }
  }
}

// Create a single shared queue for all RPC calls if in development mode
const sharedRequestQueue = isDevelopment ? new RequestQueue(3) : null; // Limit to 3 concurrent requests in development

export async function makeRPCCall({ abortSignal, method, params, rpcNodeURL }) {
  if (isDevelopment && sharedRequestQueue) {
    return new Promise((resolve, reject) => {
      sharedRequestQueue.add(async () => {
        try {
          const response = await fetch(rpcNodeURL, {
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: getNextRequestId().toString(),
              method,
              params,
            }),
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            signal: abortSignal,
          });
          const result = await response.json();
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });
  } else {
    // Normal execution without rate limiting
    try {
      const response = await fetch(rpcNodeURL, {
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: getNextRequestId().toString(),
          method,
          params,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        signal: abortSignal,
      });
      return await response.json();
    } catch (e) {
      throw e;
    }
  }
}
