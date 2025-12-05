export const getVercelHeaders = async (): Promise<HeadersInit> => {
  const forwardedHeaders: HeadersInit = {};

  // In Vercel preview/production, we can use environment variables
  // to construct headers for internal service-to-service communication
  if (process.env.VERCEL) {
    // Forward Vercel deployment URL if available
    if (process.env.VERCEL_URL) {
      forwardedHeaders["x-vercel-deployment-url"] = process.env.VERCEL_URL;
    }

    // Forward Vercel environment
    if (process.env.VERCEL_ENV) {
      forwardedHeaders["x-vercel-env"] = process.env.VERCEL_ENV;
    }
  }

  // If there's an internal API key for service-to-service auth, use it
  const internalApiKey = process.env.INTERNAL_API_KEY;
  if (internalApiKey) {
    forwardedHeaders["authorization"] = `Bearer ${internalApiKey}`;
  }

  return forwardedHeaders;
};
