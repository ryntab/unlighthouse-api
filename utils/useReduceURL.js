// Desc: Reduces a URL to its base domain

const useReduceURL = (url) => {
  // Check if url starts with http:// or https://, prepend http:// if it does not
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url;
  }

  const parsedUrl = new URL(url);
  let hostname = parsedUrl.hostname;

  // Check if the hostname starts with "www." before removing it
  // if (hostname.startsWith("www.")) {
  //   hostname = hostname.replace(/^www\./, '');
  // }
  
  return `${hostname}`;
}

export { useReduceURL }
