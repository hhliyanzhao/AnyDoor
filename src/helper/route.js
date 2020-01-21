const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const promisify = require("util").promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const config = require('../config/defaultconfig');
const mime = require('./mime');
const compress = require('./compress');
const isFresh = require('./cache');
const tplpath = path.join(__dirname, '../template/dir.tpl');
const source = fs.readFileSync(tplpath);
const template = handlebars.compile(source.toString());

module.exports = async function (req, res, filepath) {
  try {
    const stats = await stat(filepath);


    if (stats.isFile()) {
      let contentType = mime(filepath);
      contentType = contentType ? contentType : 'text/plain';

      res.setHeader('Content-Type', contentType);
      if (isFresh(stats, req, res)) {
        res.statusCode = 304;
        res.end();
        return;
      }
      res.statusCode = 200;
      let rs = fs.createReadStream(filepath);
      if (filepath.match(config.compress)) {
        rs = compress(rs, req, res);
      }
      rs.pipe(res);
    } else if (stats.isDirectory()) {
      res.statusCode = 200;
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
    console.log(error);
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('no such a drectory or file!');
  }
}
