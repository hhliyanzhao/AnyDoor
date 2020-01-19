const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const promisify = require("util").promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const config = require('../config/defaultconfig');
const tplpath = path.join(__dirname, '../template/dir.tpl');
const source = fs.readFileSync(tplpath);
const template = handlebars.compile(source.toString());

module.exports = async function (req, res, filepath) {
  try {
    const stats = await stat(filepath);
    res.statusCode = 200;

    if (stats.isFile()) {
      res.setHeader('Content-Type', 'text/plain');
      fs.createReadStream(filepath).pipe(res);
    } else if (stats.isDirectory()) {
      res.setHeader('Content-Type', 'text/html');
      const dir = await readdir(filepath);
      const currentdir = path.relative(config.root, filepath);
      const data = {
        title: path.basename(filepath),
        currentdir: currentdir ? `/${currentdir}` : '',
        dir
      }
      res.end(template(data));
    }
  } catch (error) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('no such a drectory or file!');
  }
}
