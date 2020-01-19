const http = require('http');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const config = require('./config/defaultconfig');

const server = http.createServer((req, res) => {
  const url = req.url;
  const filepath = path.join(config.root, url);
  fs.stat(filepath, (err, stat) => {
    if (err) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`${filepath} is not directory or file!`);
      return;
    } else if (stat.isFile()) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      fs.createReadStream(filepath).pipe(res);
    } else if (stat.isDirectory()) {
      fs.readdir(filepath, (err, files) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(files.join(','));
      })
    }
  })
});

server.listen(config.port, config.hostname, () => {
  const addr = `http://${config.hostname}:${config.port}`;
  console.info(`server started at ${chalk.green(addr)}`);
});
