module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('grunt_package.json'),
        uglify: {
            options: {
                         banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */    \n'
                     },
            build:{
                      files:{
                                'public/js/mclassical-base.js':[
        				'public/js/zepto.min.js',
					'public/js/tween.min.js',
					'public/js/xss.min.js',
					'public/js/mclassical-utils.suiyiwannong.js'
				],
                                'public/js/mclassical-pano.js':[
					'public/js/mclassical-pano.suiyiwannong.js'
				]
                        }
            }
            //build: {
            //           src: 'src/<%= pkg.name %>.js',
            //            dest: 'build/<%= pkg.name %>.min.js'
            //       }
        }
    });

    // Load the plugin that provides the "uglify"task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['uglify']);

};
