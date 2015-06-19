module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        shell: {
            TypeScript: {
                command: 'node node_modules/typescript/bin/tsc.js bootstrap.ts --out ../js/hash-routing.js --sourceMap'
            }
        },
        less: {
            development: {
                options: {
                },
                files: {
                    "../css/style.css": "less/style.less"
                }
            },
            prod: {
                options: {
                    compress: true
                },
                files: {
                    "../css/style.min.css": "less/style.less"
                }
            }
        },
        concat_css: {
            options: {
                },
            development: {
                src: [
                    'node_modules/bootstrap/dist/css/bootstrap.min.css',
                    'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
                    '../css/style.css'
                ],
                dest: '../css/style-prod.css'
            },
            prod: {
                src: [
                    'node_modules/bootstrap/dist/css/bootstrap.min.css',
                    'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
                    '../css/style.min.css'
                ],
                dest: '../css/style-prod.min.css'
            }
        },
        uglify: {
            options: {
                banner: [
                    '/*! <%= pkg.name %> - v<%= pkg.version %> - ',
                    '<%= grunt.template.today("yyyy-mm-dd") %> */'
                ].join('')
            },
            prod: {
                files: {
                    '../js/hash-routing.min.js': ['../hash-routing.js']
                }
            }
        },
        watch: {
            scripts: {
                files: ['**/*.ts'],
                tasks: ['shell']
            },
            styles: {
                files: ['less/*.less'],
                tasks: ['less:development', 'concat_css:development']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('default', ['less:development', 'concat_css:development', 'shell', 'watch']);
    grunt.registerTask('prod', ['less:prod', 'concat_css:prod', 'shell', 'uglify:prod']);

};