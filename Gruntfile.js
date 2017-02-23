'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    jshint: {
      files: ['controllers/*.js', 'lib/*.js', 'lib/**/*.js',
        'models/*.js', 'routes/*.js', 'routes/**/*.js','scripts/*.js', 'services/*.js',
       'app.js', 'Gruntfile.js','*.js'],
      options: grunt.file.readJSON('.jshintrc')
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('build', ['clean', 'less', 'browserify', 'notify']);

};