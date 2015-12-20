module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('grunt_package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n/*author:greenSnot@github */    \n'
                     },
            build:{
                      files:{
                                'public/js/mclassical-base.js':[
                    'public/js/zepto.min.js',
					'public/js/tween.min.js',
					'public/js/xss.min.js',
					'front_source/js/mclassical-utils.js'
				],
                                'public/js/snot-utils.min.js':[
					'front_source/js/snot-utils.js'
                ],
                                'public/js/snot-pano.min.js':[
					'front_source/js/snot-pano-css.js'
				],
                                'public/js/audio.min.js':[
                    'front_source/js/audio.js'
                            ]
                        }
            }
        }
    });

    // Load the plugin that provides the "uglify"task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['uglify']);

};
