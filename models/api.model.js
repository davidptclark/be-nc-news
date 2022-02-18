const fs = require('fs/promises');

exports.fetchEndpointDescriptions = async () => {
  const descriptions = await fs.readFile('./endpoints.json', 'utf-8');
  const parsedDescriptions = JSON.parse(descriptions);

  return parsedDescriptions;
};
