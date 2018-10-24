const fs = require('fs');

let rawData = fs.readFileSync(`./config.json`);
let configuration = JSON.parse(rawData);

console.log(`the server is starting...`);

module.exports = {
  enviornment: configuration.environment,
  db1ConnectionString: configuration.connections.db1.DB1ConString
}
