export function useReduceURL (url) {
  // Check if the URL starts with http:// or https://, prepend http:// if it does not
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url;
  }

  const parsedUrl = new URL(url);
  let hostname = parsedUrl.hostname;

  // Remove the "www." prefix if it exists
  if (hostname.startsWith('www.')) {
    hostname = hostname.replace(/^www\./, '');
  }
  
  return hostname;
}