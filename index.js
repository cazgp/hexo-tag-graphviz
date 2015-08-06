var fs = require('hexo-fs');
var child_process = require('child_process');
var crypto = require('crypto');
var log = hexo.log;

var createGraphviz = function(path, content) {
  return fs.ensureWriteStream(path).then(function(fileStream) {
    return new Promise(function(resolve, reject) {
      var options = { stdio: [null, null, null, 'pipe'] };
      var proc = child_process.spawn('dot', [
        '-Tpng'
      ], options);
      var error = [];
      proc.stderr.on('data', function(err) {
        error.push(err.toString());
      });
      proc.on('error', function(err) {
        return reject(err);
      });
      proc.on('close', function() {
        if(!error || !error.length) return resolve();
        var msg = error.join('\n') + content;
        log.error(msg);
        return fs.unlink(path).then(function() {
          return reject(msg);
        });
      });
      // proc.stderr.pipe(process.stdout);
      proc.stdout.pipe(fileStream);
      proc.stdin.write(content);
      proc.stdin.end();
    });
  });
};

var graphviz = function(args, content) {
  // Hash the content of the file to get its name.
  var name = crypto.createHash('sha1')
    .update(content)
    .digest('hex') + '.png';
  var path = this.asset_dir + name;

  // If the file already exists, skip.
  return fs.exists(path).then(function(exists) {
    if(exists) return;
    return createGraphviz(path, content);
  }).then(function() {
    return hexo.render.render({ path: __dirname + '/img.ejs' }, {
      caption: args.join(' '),
      src: name
    });
  });

};

hexo.extend.tag.register('graphviz', graphviz, { async: true, ends: true });
