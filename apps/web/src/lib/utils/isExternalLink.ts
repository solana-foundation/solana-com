export const isExternalLink = (url: string | undefined) => {
  if (!url) return false;

  if (url.startsWith("/")) {
    return false;
  }

  // If it contains a domain (with or without protocol)
  const hasDomain =
    /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/.test(url);

  return hasDomain;
};
