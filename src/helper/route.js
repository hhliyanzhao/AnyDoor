const fs = require('fs');
const promisify = require("util").promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);


module.exports = async function(req,res,filepath) {
  try {
    const stats = await stat(filepath);
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    if (stats.isFile()) {
      fs.createReadStream(filepath).pipe(res);
    } else if(stats.isDirectory()){
      const dir = await readdir(filepath);
      res.end(dir.join(','));
    }
  } catch (error) {
    res.statusCode = 404;
    res.setHeader('Content-Type','text/plain');
    res.end('no such a drectory or file!');
  }
}
