module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('grunt_package.j    son'),
        uglify: {
            options: {
                         banner: '/*! <%= pkg.nam    e %> <%= grunt.template.today("yyyy-mm-dd") %> */    \n'
                     },
            build:{
                      files:{
                                'public/js/zepto-tween-xss-pano.min.js':[
        'public/js/zepto.min.js','public/js/tween.min.js','public/js/xss.min.js','public/js/mclassical-utils.suiyiwannong.js','public/js/mclassical-pano.suiyiwannong.js']
                        }
            }
            //build: {
            //           src: 'src/<%= pkg.name %    >.js',
            //            dest: 'build/<%= pkg.na    me %>.min.js'
            //       }
        }
    });

    // Load the plugin that provides the "uglify"     task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['uglify']);

};
