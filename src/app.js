const http = require('http');
const chalk = require('chalk');
const path = require('path');
const route = require('./helper/route');
const config = require('./config/defaultconfig');

const server = http.createServer((req, res) => {
  const url = req.url;
  const filepath = path.join(config.root, url);
  route(req, res, filepath);
});

server.listen(config.port, config.hostname, () => {
  const addr = `http://${config.hostname}:${config.port}`;
  console.info(`server started at ${chalk.green(addr)}`);
});
