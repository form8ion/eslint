export default function extractScope({extends: extensions}) {
  if (Array.isArray(extensions)) return extensions.find(config => !config.includes('/'));

  return extensions;
}
