var childProcess = require('child_process'),
    fs = require('fs');

module.exports = function(grunt) {
  grunt.registerTask('test:bin', function() {
    var done = this.async();

    childProcess.exec('node ./bin/handlebars -a spec/artifacts/empty.handlebars', function(err, stdout) {
      if (err) {
        throw err;
      }

      var expected = fs.readFileSync('./spec/expected/empty.amd.js').toString().replace(/\r\n/g, '\n');

      if (stdout.toString() !== expected) {
        throw new Error('Expected binary output differed:\n\n"' + stdout + '"\n\n"' + expected + '"');
      }

      done();
    });
  });
  grunt.registerTask('test:mocha', function() {
    var done = this.async();

    var runner = childProcess.fork('./spec/env/runner', [], {stdio: 'inherit'});
    runner.on('close', function(code) {
      if (code != 0) {
        grunt.fatal(code + ' tests failed');
      }
      done();
    });
  });
  grunt.registerTask('test:min', function() {
    var done = this.async();

    var runner = childProcess.fork('./spec/env/runner', ['--min'], {stdio: 'inherit'});
    runner.on('close', function(code) {
      if (code != 0) {
        grunt.fatal(code + ' tests failed');
      }
      done();
    });
  });
  grunt.registerTask('test', ['test:bin']);
};
