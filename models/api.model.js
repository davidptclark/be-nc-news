const fs = require('fs/promises');
//While you've created new controllers with async, remember to refactor older ones using async too
exports.fetchEndpointDescriptions = async () => {
  const jsonDescriptions = await fs.readFile('./endpoints.json', 'utf-8');
  const parsedDescriptions = JSON.parse(jsonDescriptions);

  return parsedDescriptions;
};
